export interface IPayloadStripeSuccess {
  stripePaymentId?: string;
  contributionId: string;
  receiptUrl?: string;
}
