'use client'
import { useState } from 'react'
import { format, addDays, isWeekend, startOfToday } from 'date-fns'
import { uk } from 'date-fns/locale'

const SERVICES = [
  { label: 'Первинна консультація', price: 1200 },
  { label: 'Повторна консультація', price: 900 },
  { label: 'Онлайн-консультація', price: 1800 },
]

const TIME_SLOTS = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']
const PAYMENT_URL = 'https://bank-qr.com.ua/pay/QkNECjAwMgoxClVDVAoK0KTQntCfINCe0YHRgtCw0L_Rh9GD0Log0JDQvdC90LAg0IbQs9C-0YDRltCy0L3QsApVQTA3MzIyMDAxMDAwMDAyNjAwNzM1MDA5Njg4MQpVQUgxMjAwCjMzODg0MDEwODIKCgrQntC_0LvQsNGC0LAg0LfQsCDQvdCw0LTQsNC90L3RjyDQutC-0L3RgdGD0LvRjNGC0LDRhtGW0LnQvdC40YUg0L_QvtGB0LvRg9CzCgo'
const DOCTOR_EMAIL = 'bezkrovnyi28@gmail.com'

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
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', notes: '' })
  const [serviceIdx, setServiceIdx] = useState(0)
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
          dob: form.dob || null, consultType: service.label,
          price: service.price, notes: form.notes, appointmentAt,
        }),
      })

      setStep(4)
    } catch (e) {
      alert('Помилка. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  const stepLabel = ['', 'Дані пацієнта', 'Дата і час', 'Оплата', 'Готово']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <span className="text-blue-600 text-xl">⚕</span>
          Ендокринолог Коваль
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-800">Про лікаря</a>
          <a href="#" className="hover:text-gray-800">Послуги</a>
          <a href="#" className="hover:text-gray-800">Контакти</a>
        </div>
      </nav>

      <div className="bg-blue-50 border-b border-blue-100 px-6 py-6 flex gap-5 items-center">
        <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl flex-shrink-0">👩‍⚕️</div>
        <div>
          <h1 className="text-xl font-medium text-gray-900">Коваль Олена Вікторівна</h1>
          <p className="text-sm text-gray-500 mt-1">Ендокринолог вищої категорії · Стаж 18 років</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {['⭐ 4.9 · 247 відгуків','📍 Харків, вул. Сумська 25','🕐 Пн–Пт 9:00–18:00'].map(b => (
              <span key={b} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-500">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">

          {/* Steps */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-5">
              {[1,2,3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                    ${step === n ? 'bg-blue-600 text-white' : step > n ? 'bg-green-500 text-white' : 'border border-gray-300 text-gray-400'}`}>
                    {step > n ? '✓' : n}
                  </div>
                  <span className={`text-sm ${step === n ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{stepLabel[n]}</span>
                  {n < 3 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-base font-medium mb-4">Дані пацієнта</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Ім'я та прізвище", key: 'name', placeholder: 'Іван Петренко', type: 'text', full: true },
                    { label: 'Email', key: 'email', placeholder: 'email@example.com', type: 'email' },
                    { label: 'Телефон', key: 'phone', placeholder: '+380 67 123 45 67', type: 'tel' },
                    { label: 'Дата народження', key: 'dob', placeholder: '', type: 'date' },
                  ].map(f => (
                    <div key={f.key} className={f.full ? 'col-span-2' : ''}>
                      <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => updateForm(f.key, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Тип консультації</label>
                    <select value={serviceIdx} onChange={e => setServiceIdx(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {SERVICES.map((s, i) => <option key={i} value={i}>{s.label} — {s.price} ₴</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Скарги / причина звернення</label>
                    <textarea rows={3} placeholder="Опишіть симптоми або питання..."
                      value={form.notes} onChange={e => updateForm('notes', e.target.value)}
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

            {/* Step 3 — Оплата */}
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

                <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer"
                  onClick={handlePay}
                  className="block w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 text-center cursor-pointer">
                  {loading ? 'Зберігаємо запис...' : `💳 Оплатити ${service.price} ₴`}
                </a>

                <button onClick={() => setStep(2)} className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700 py-2">← Назад</button>
              </div>
            )}

            {/* Step 4 — Підтвердження */}
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
                  <p>Надішліть скріншот оплати на email лікаря:</p>
                  <p className="font-medium mt-1">{DOCTOR_EMAIL}</p>
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
              <div key={s.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                <span className="text-gray-600">{s.label}</span>
                <span className="font-medium text-blue-600">{s.price} ₴</span>
              </div>
            ))}
          </div>

          {(selectedDate || selectedTime) && step < 4 && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-sm">
              <h3 className="text-sm font-medium mb-3 text-blue-800">Ваш запис</h3>
              <div className="space-y-1 text-blue-700">
                <div>📋 {service.label}</div>
                {selectedDate && <div>📅 {format(selectedDate, 'd MMMM yyyy', { locale: uk })}</div>}
                {selectedTime && <div>🕐 {selectedTime}</div>}
                <div className="font-medium pt-1">💰 {service.price} ₴</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-500 space-y-2">
            <div>📍 вул. Сумська, 25, Харків</div>
            <div>📞 +380 57 123 45 67</div>
            <div>⏰ Пн–Пт 9:00–18:00, Сб 10:00–14:00</div>
            <div className="text-xs text-gray-400 pt-1">Скасування без штрафу — не пізніше ніж за 24 год</div>
          </div>
        </div>
      </div>
    </div>
  )
}