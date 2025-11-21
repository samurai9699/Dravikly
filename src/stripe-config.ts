export interface StripeProduct {
  id: string
  priceId: string
  name: string
  description: string
  price: number
  currency: string
  currencySymbol: string
  mode: 'payment' | 'subscription'
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TSsfPAcKlCMOLx',
    priceId: 'price_1SVwuUDnl7eA7o2IRMhLhKSl',
    name: 'ULTRA',
    description: 'Premium subscription with all features included',
    price: 99.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'subscription'
  },
  {
    id: 'prod_TSsWeppv4rulwG',
    priceId: 'price_1SVwlwDnl7eA7o2Ir9e5XeMB',
    name: 'PRO',
    description: 'Professional subscription with advanced features',
    price: 29.00,
    currency: 'usd',
    currencySymbol: '$',
    mode: 'subscription'
  }
]

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId)
}