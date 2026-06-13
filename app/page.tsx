'use client'
import { useState } from 'react'
import { format, addDays, isWeekend, startOfToday } from 'date-fns'
import { uk } from 'date-fns/locale'

// ============================================
// НАЛАШТУВАННЯ — змінюй тут
// ============================================
const DOCTOR_NAME = 'Остапчук Анна Ігорівна'
const DOCTOR_SPEC = 'Ендокринолог · Косметолог'
const DOCTOR_CITY = 'Київ'
const DOCTOR_PHONE = '+380 99 259 05 95'
const DOCTOR_EMAIL = 'email@example.com' // ← замінити на реальний
const DOCTOR_INSTAGRAM = '@your_instagram' // ← замінити на реальний
const DOCTOR_HOURS = 'Пн–Пт 10:00–19:00'

const SERVICES = [
  { label: 'Онлайн-консультація', price: 1200 },
]

const TIME_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
]

const PAYMENT_URL = 'https://bank-qr.com.ua/pay/QkNECjAwMgoxClVDVAoK0KTQntCfINCe0YHRgtCw0L_Rh9GD0Log0JDQvdC90LAg0IbQs9C-0YDRltCy0L3QsApVQTA3MzIyMDAxMDAwMDAyNjAwNzM1MDA5Njg4MQpVQUgxMjAwCjMzODg0MDEwODIKCgrQntC_0LvQsNGC0LAg0LfQsCDQvdCw0LTQsNC90L3RjyDQutC-0L3RgdGD0LvRjNGC0LDRhtGW0LnQvdC40YUg0L_QvtGB0LvRg9CzCgo'
// ============================================

function getAvailableDays() {
  const days: Date[] = []
  let d = addDays(startOfToday(), 1)
  while (days.length < 25) {
    if (!isWeekend(d)) days.push(new Date(d))
    d = addDays(d, 1)
  }
  return days
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', instagram: '', notes: '' })
  const [serviceIdx] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const service = SERVICES[serviceIdx]
  const availableDays = getAvailableDays()
  const updateForm = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  async function handlePay() {
    setLoading(true)
    try {
      const appointmentAt = new Date(
        `${format(selectedDate!, 'yyyy-MM-dd')}T${selectedTime}:00`
      ).toISOString()

      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          dob: null, consultType: service.label,
          price: service.price, notes: `Instagram: ${form.instagram}\n${form.notes}`, appointmentAt,
        }),
      })
      setStep(4)
    } catch (e) {
      alert('Помилка. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <span className="text-blue-600 text-xl">⚕</span>
          {DOCTOR_NAME}
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-800">Про мене</a>
          <a href="#" className="hover:text-gray-800">Послуги</a>
          <a href="#" className="hover:text-gray-800">Контакти</a>
        </div>
      </nav>

      <div className="bg-blue-50 border-b border-blue-100 px-6 py-6 flex gap-5 items-center">
        <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl flex-shrink-0">👩‍⚕️</div>
        <div>
          <h1 className="text-xl font-medium text-gray-900">{DOCTOR_NAME}</h1>
          <p className="text-sm text-gray-500 mt-1">{DOCTOR_SPEC}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[`📍 ${DOCTOR_CITY}`, `🕐 ${DOCTOR_HOURS}`, `📱 ${DOCTOR_INSTAGRAM}`].map(b => (
              <span key={b} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-500">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">

          {step < 4 && (
            <div className="flex items-center gap-2 mb-5">
              {[['1','Дані'],['2','Дата і час'],['3','Оплата']].map(([n, label], i) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                    ${step === i+1 ? 'bg-blue-600 text-white' : step > i+1 ? 'bg-green-500 text-white' : 'border border-gray-300 text-gray-400'}`}>
                    {step > i+1 ? '✓' : n}
                  </div>
                  <span className={`text-sm ${step === i+1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{label}</span>
                  {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-base font-medium mb-4">Ваші дані</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Ім'я та прізвище</label>
                    <input type="text" placeholder="Іван Петренко" value={form.name}
                      onChange={e => updateForm('name', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    <input type="email" placeholder="email@example.com" value={form.email}
                      onChange={e => updateForm('email', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Телефон</label>
                    <input type="tel" placeholder="+380 99 123 45 67" value={form.phone}
                      onChange={e => updateForm('phone', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Instagram (необов'язково)</label>
                    <input type="text" placeholder="@your_instagram" value={form.instagram}
                      onChange={e => updateForm('instagram', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Запитання / причина звернення</label>
                    <textarea rows={3} placeholder="Опишіть симптоми або питання..." value={form.notes}
                      onChange={e => updateForm('notes', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.phone}
                  className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  Далі — обрати дату →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-base font-medium mb-4">Оберіть дату та час</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
                  {availableDays.map(d => (
                    <button key={d.toISOString()} onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
                      className={`py-2 px-1 rounded-lg text-xs border transition-colors
                        ${selectedDate?.toDateString() === d.toDateString() ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400 text-gray-700'}`}>
                      <div className="font-medium">{format(d, 'd MMM', { locale: uk })}</div>
                      <div className="text-[10px] opacity-70">{format(d, 'EEE', { locale: uk })}</div>
                    </button>
                  ))}
                </div>
                {selectedDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Вільний час на {format(selectedDate, 'd MMMM', { locale: uk })}:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(t => (
                        <button key={t} onClick={() => setSelectedTime(t)}
                          className={`py-2 text-sm rounded-lg border transition-colors
                            ${selectedTime === t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400 text-gray-700'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-5">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-50">← Назад</button>
                  <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    Далі — до оплати →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-base font-medium mb-4">Оплата</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Послуга</span><span>{service.label}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Дата</span>
                    <span>{selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: uk }) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Час</span><span>{selectedTime}</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                    <span>Разом</span><span className="text-blue-600">{service.price} ₴</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">Після натискання кнопки відкриється сторінка оплати Monobank у новій вкладці</p>
                <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" onClick={handlePay}
                  className="block w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 text-center">
                  {loading ? 'Зберігаємо...' : `💳 Оплатити ${service.price} ₴`}
                </a>
                <button onClick={() => setStep(2)} className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700 py-2">← Назад</button>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Запис оформлено!</h2>
                <p className="text-sm text-gray-500 mb-4">Сторінка оплати відкрилась у новій вкладці</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-left space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Пацієнт</span><span className="font-medium">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Послуга</span><span>{service.label}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Дата</span>
                    <span>{selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: uk }) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Час</span><span>{selectedTime}</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                    <span>Сума</span><span className="text-blue-600">{service.price} ₴</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 text-left mb-4">
                  <p className="font-medium mb-1">📋 Після оплати:</p>
                  <p>Надішліть скріншот оплати в Instagram або на email:</p>
                  <p className="font-medium mt-1">{DOCTOR_INSTAGRAM}</p>
                  <p className="font-medium">{DOCTOR_EMAIL}</p>
                </div>
                <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer"
                  className="block w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 text-center">
                  🔄 Відкрити оплату знову
                </a>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium mb-3">Послуги та ціни</h3>
            {SERVICES.map(s => (
              <div key={s.label} className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">{s.label}</span>
                <span className="font-medium text-blue-600">{s.price} ₴</span>
              </div>
            ))}
          </div>

          {selectedDate && selectedTime && step < 4 && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-sm">
              <h3 className="text-sm font-medium mb-3 text-blue-800">Ваш запис</h3>
              <div className="space-y-1 text-blue-700">
                <div>📋 {service.label}</div>
                <div>📅 {format(selectedDate, 'd MMMM yyyy', { locale: uk })}</div>
                <div>🕐 {selectedTime}</div>
                <div className="font-medium pt-1">💰 {service.price} ₴</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-500 space-y-2">
            <div>📍 {DOCTOR_CITY}</div>
            <div>📞 {DOCTOR_PHONE}</div>
            <div>📱 {DOCTOR_INSTAGRAM}</div>
            <div>⏰ {DOCTOR_HOURS}</div>
          </div>
        </div>
      </div>
    </div>
  )
}