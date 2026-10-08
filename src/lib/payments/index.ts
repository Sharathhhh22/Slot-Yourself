export interface PaymentRequest {
  appointmentId: string
  amount: number
  currency: string
  description: string
  metadata?: Record<string, string>
  successUrl: string
  cancelUrl: string
}

export interface PaymentResult {
  sessionId: string
  paymentUrl: string
}

export interface PaymentProvider {
  /**
   * Creates a checkout session for online payment.
   */
  createCheckoutSession(req: PaymentRequest): Promise<PaymentResult>
}
