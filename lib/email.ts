import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingEmailData {
  patientName: string
  patientEmail: string
  consultType: string
  appointmentAt: string
  price: number
}

export async function sendConfirmationEmail(data: BookingEmailData) {
  const { patientName, patientEmail, consultType, appointmentAt, price } = data

  // Лист пацієнту
  await resend.emails.send({
    from: 'Ендокринолог Коваль <noreply@your-domain.com>',
    to: patientEmail,
    subject: `✅ Запис підтверджено — ${appointmentAt}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #185FA5;">Ваш запис підтверджено!</h2>
        <p>Вітаємо, <strong>${patientName}</strong>!</p>
        <p>Ваш запис успішно оформлено та оплачено.</p>
        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr><td style="padding:8px; color:#666;">Послуга:</td><td style="padding:8px;"><strong>${consultType}</strong></td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px; color:#666;">Дата і час:</td><td style="padding:8px;"><strong>${appointmentAt}</strong></td></tr>
          <tr><td style="padding:8px; color:#666;">Сума оплачено:</td><td style="padding:8px;"><strong>${price} ₴</strong></td></tr>
        </table>
        <p style="color:#666; font-size:13px;">Нагадування надійде за 24 години та за 1 годину до прийому.</p>
        <p style="color:#666; font-size:13px;">Адреса: вул. Сумська, 25, Харків</p>
        <p style="color:#666; font-size:13px;">Скасування можливе не пізніше ніж за 24 години до прийому.</p>
      </div>
    `,
  })

  // Лист лікарю
  await resend.emails.send({
    from: 'Booking System <noreply@your-domain.com>',
    to: process.env.DOCTOR_EMAIL!,
    subject: `📅 Новий запис — ${patientName} — ${appointmentAt}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #185FA5;">Новий запис на прийом</h2>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:8px; color:#666;">Пацієнт:</td><td style="padding:8px;"><strong>${patientName}</strong></td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px; color:#666;">Email:</td><td style="padding:8px;">${patientEmail}</td></tr>
          <tr><td style="padding:8px; color:#666;">Послуга:</td><td style="padding:8px;"><strong>${consultType}</strong></td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px; color:#666;">Дата і час:</td><td style="padding:8px;"><strong>${appointmentAt}</strong></td></tr>
          <tr><td style="padding:8px; color:#666;">Сума:</td><td style="padding:8px;"><strong>${price} ₴</strong></td></tr>
        </table>
      </div>
    `,
  })
}
