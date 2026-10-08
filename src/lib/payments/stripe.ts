import Stripe from 'stripe'
import { PaymentProvider, PaymentRequest, PaymentResult } from './index'

export class StripeProvider implements PaymentProvider {
  private stripe: any = null

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        // any
      })
    }
  }

  async createCheckoutSession(req: PaymentRequest): Promise<PaymentResult> {
    if (!this.stripe) {
      // Mocking for testing if Stripe keys are not set
      console.log("Mocking Stripe Checkout Session because STRIPE_SECRET_KEY is missing.")
      const mockSessionId = 'mock_session_' + req.appointmentId
      return {
        sessionId: mockSessionId,
        paymentUrl: req.successUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId)
      }
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: req.currency,
            product_data: {
              name: req.description,
            },
            unit_amount: req.amount * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata: req.metadata,
      client_reference_id: req.appointmentId
    })

    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session URL")
    }

    return {
      sessionId: session.id,
      paymentUrl: session.url
    }
  }
}
