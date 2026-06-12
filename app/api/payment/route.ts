import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyLiqPayCallback, decodeLiqPayData } from '@/lib/liqpay'
import { sendConfirmationEmail } from '@/lib/email'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const data = formData.get('data') as string
    const signature = formData.get('signature') as string

    // Перевірити підпис від LiqPay
    if (!verifyLiqPayCallback(data, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const payload = decodeLiqPayData(data)
    const { order_id, status, amount } = payload

    // Оновити статус в БД
    const newStatus = status === 'success' || status === 'sandbox' ? 'paid' : 'pending'

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update({ status: newStatus, liqpay_order_id: order_id })
      .eq('id', order_id)
      .select()
      .single()

    if (error) throw error

    // Відправити email після успішної оплати
    if (newStatus === 'paid' && booking) {
      const appointmentFormatted = format(
        new Date(booking.appointment_at),
        "d MMMM yyyy 'о' HH:mm",
        { locale: uk }
      )
      await sendConfirmationEmail({
        patientName: booking.name,
        patientEmail: booking.email,
        consultType: booking.consult_type,
        appointmentAt: appointmentFormatted,
        price: booking.price,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Callback error' }, { status: 500 })
  }
}
