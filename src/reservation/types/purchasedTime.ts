export const PurchasedTime = {
  PurchasedOneHour: 'ONEHOUR',
  PurchasedTwoHour: 'TWOHOUR',
  PurchasedThreeHour: 'THREEHOUR',
} as const;

export type PurchasedTime = (typeof PurchasedTime)[keyof typeof PurchasedTime];
export const purchasedTime = Object.values(PurchasedTime);
