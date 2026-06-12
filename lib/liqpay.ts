import crypto from 'crypto'

const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY!
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY!

export function generateLiqPayForm(params: {
  orderId: string
  amount: number
  description: string
  resultUrl: string
  serverUrl: string
}) {
  const data = Buffer.from(
    JSON.stringify({
      public_key: PUBLIC_KEY,
      version: '3',
      action: 'pay',
      amount: params.amount,
      currency: 'UAH',
      description: params.description,
      order_id: params.orderId,
      result_url: params.resultUrl,
      server_url: params.serverUrl,
      language: 'uk',
    })
  ).toString('base64')

  const signature = crypto
    .createHash('sha1')
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest('base64')

  return { data, signature }
}

export function verifyLiqPayCallback(data: string, signature: string): boolean {
  const expected = crypto
    .createHash('sha1')
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest('base64')
  return expected === signature
}

export function decodeLiqPayData(data: string) {
  return JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
}
