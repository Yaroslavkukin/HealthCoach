export type PremiumProduct = 'healthcoach_premium';

export type SubscriptionStatus = {
  active: boolean;
  product: PremiumProduct;
  activeUntil: string | null;
  source: string | null;
  reason: string | null;
};
