export const PurchasedTime = {
  PurchasedOneHour: 'HOUR1',
  PurchasedTwoHour: 'HOUR2',
  PurchasedThreeHour: 'HOUR3',
} as const;

export type PurchasedTime = (typeof PurchasedTime)[keyof typeof PurchasedTime];
export const purchasedTime = Object.values(PurchasedTime);
