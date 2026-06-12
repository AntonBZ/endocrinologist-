import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { booking_id?: string }
}) {
  const bookingId = searchParams.booking_id

  if (!bookingId) {
    return <div className="p-8 text-center text-gray-500">Запис не знайдено</div>
  }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (!booking) {
    return <div className="p-8 text-center text-gray-500">Запис не знайдено</div>
  }

  const isPaid = booking.status === 'paid'
  const appointmentFormatted = format(
    new Date(booking.appointment_at),
    "d MMMM yyyy 'о' HH:mm",
    { locale: uk }
  )

  // Google Calendar посилання
  const gcStart = format(new Date(booking.appointment_at), "yyyyMMdd'T'HHmmss")
  const gcEnd = format(new Date(new Date(booking.appointment_at).getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss")
  const gcLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Консультація: ${booking.consult_type}`)}&dates=${gcStart}/${gcEnd}&details=${encodeURIComponent(`Ендокринолог Коваль О.В.\nАдреса: вул. Сумська, 25, Харків`)}&location=${encodeURIComponent('вул. Сумська, 25, Харків')}`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4
          ${isPaid ? 'bg-green-100' : 'bg-yellow-100'}`}>
          {isPaid ? '✅' : '⏳'}
        </div>

        <h1 className="text-xl font-medium text-gray-900 mb-2">
          {isPaid ? 'Запис підтверджено!' : 'Очікуємо оплату'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isPaid
            ? 'Підтвердження вже надіслано на ваш email.'
            : 'Оплата ще обробляється. Підтвердження надійде на email.'}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
          <div className="flex gap-3"><span className="text-gray-400 w-24">Пацієнт</span><span className="font-medium">{booking.name}</span></div>
          <div className="flex gap-3"><span className="text-gray-400 w-24">Послуга</span><span>{booking.consult_type}</span></div>
          <div className="flex gap-3"><span className="text-gray-400 w-24">Дата і час</span><span>{appointmentFormatted}</span></div>
          <div className="flex gap-3"><span className="text-gray-400 w-24">Сума</span>
            <span className={isPaid ? 'text-green-600 font-medium' : 'text-gray-600'}>{booking.price} ₴ {isPaid ? '(оплачено)' : '(очікується)'}</span></div>
        </div>

        {isPaid && (
          <div className="flex flex-col gap-2">
            <a
              href={gcLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 block"
            >
              📅 Додати в Google Calendar
            </a>
            <a
              href="/"
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 block"
            >
              ← На головну
            </a>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Нагадування за 24 год та за 1 год до прийому · +380 57 123 45 67
        </p>
      </div>
    </div>
  )
}
