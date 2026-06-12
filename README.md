# 🏥 Сайт запису до ендокринолога

Повноцінний сайт для онлайн-запису на консультацію з оплатою через LiqPay.

---

## 🚀 Запуск за 5 кроків

### Крок 1 — Встановити залежності
```bash
npm install
```

### Крок 2 — Налаштувати Supabase
1. Зареєструватись на [supabase.com](https://supabase.com) → New Project
2. Відкрити **SQL Editor** → вставити і виконати вміст файлу `supabase-schema.sql`
3. Зайти в **Settings → API** → скопіювати URL та ключі

### Крок 3 — Налаштувати LiqPay
1. Зареєструватись на [liqpay.ua](https://liqpay.ua) → Бізнес → API
2. Отримати **Public Key** та **Private Key**
3. Для тестування використовувати `sandbox_` ключі

### Крок 4 — Налаштувати Resend (email)
1. Зареєструватись на [resend.com](https://resend.com) → API Keys → Create API Key
2. Додати та підтвердити свій домен (або використовувати безкоштовний @resend.dev для тесту)
3. В `lib/email.ts` замінити `noreply@your-domain.com` на свій email

### Крок 5 — Заповнити .env.local
Відкрити файл `.env.local` і вставити свої ключі:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
LIQPAY_PUBLIC_KEY=sandbox_i000000000000
LIQPAY_PRIVATE_KEY=sandbox_xxxxxxxx...
RESEND_API_KEY=re_xxxxxxxxxx
DOCTOR_EMAIL=doctor@your-domain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Запуск в режимі розробки
```bash
npm run dev
```
Відкрити [http://localhost:3000](http://localhost:3000)

---

## 🌐 Деплой на Vercel (безкоштовно)

1. Завантажити проект на [GitHub](https://github.com)
2. Зайти на [vercel.com](https://vercel.com) → New Project → підключити репозиторій
3. В налаштуваннях проекту → **Environment Variables** → додати всі змінні з `.env.local`
4. Замінити `NEXT_PUBLIC_SITE_URL` на реальний URL (напр. `https://your-site.vercel.app`)
5. Натиснути **Deploy** — готово!

> ⚠️ Після деплою скопіювати реальний URL і оновити `NEXT_PUBLIC_SITE_URL` — LiqPay потребує реального callback URL.

---

## 📁 Структура проекту

```
├── app/
│   ├── page.tsx              # Головна сторінка з формою запису
│   ├── confirmation/
│   │   └── page.tsx          # Сторінка після оплати
│   ├── api/
│   │   ├── booking/route.ts  # API: створити запис + генерувати LiqPay форму
│   │   └── payment/route.ts  # API: вебхук від LiqPay після оплати
│   └── layout.tsx
├── lib/
│   ├── supabase.ts           # Supabase клієнт
│   ├── liqpay.ts             # LiqPay helper (підпис, верифікація)
│   └── email.ts              # Resend email відправка
├── supabase-schema.sql       # SQL схема БД — виконати один раз
└── .env.local                # Ваші ключі (не комітити в git!)
```

---

## ✅ Що вже реалізовано

- [x] Форма запису з валідацією (ім'я, email, телефон, тип консультації)
- [x] Вибір дати (тільки робочі дні, +1 день мінімум)
- [x] Вибір часу з часових слотів
- [x] Збереження запису в Supabase зі статусом `pending`
- [x] Генерація форми оплати LiqPay (підтримка sandbox)
- [x] Вебхук після оплати → оновлення статусу на `paid`
- [x] Автоматичний email пацієнту і лікарю після оплати (Resend)
- [x] Сторінка підтвердження з деталями запису
- [x] Кнопка "Додати в Google Calendar" (посилання)

## 🔜 Що можна додати пізніше

- [ ] Адмін-панель для лікаря (список записів, управління слотами)
- [ ] SMS-нагадування (через Twilio або Ukrainian SMS API)
- [ ] Google Calendar API (автоматичне додавання без кліку)
- [ ] Скасування запису пацієнтом
- [ ] Кабінет пацієнта (список своїх записів)
