import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ендокринолог Коваль — Запис на консультацію',
  description: 'Онлайн запис до ендокринолога. Консультації щодо діабету, щитовидної залози, гормональних порушень.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
