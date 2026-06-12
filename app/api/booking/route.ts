import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateLiqPayForm } from '@/lib/liqpay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, dob, consultType, price, notes, appointmentAt } = body

    // Зберегти запис в БД зі статусом pending
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({ name, email, phone, dob, consult_type: consultType, price, notes, appointment_at: appointmentAt, status: 'pending' })
      .select()
      .single()

    if (error) throw error

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    // Генерувати LiqPay форму
    const { data, signature } = generateLiqPayForm({
      orderId: booking.id,
      amount: price,
      description: `${consultType} — ${name}`,
      resultUrl: `${siteUrl}/confirmation?booking_id=${booking.id}`,
      serverUrl: `${siteUrl}/api/payment`,
    })

    return NextResponse.json({ bookingId: booking.id, liqpayData: data, liqpaySignature: signature })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Помилка створення запису' }, { status: 500 })
  }
}
