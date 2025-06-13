export const ReservationAdvancement = {
  P0: 'Początkujący',
  P1: 'Podstawowy',
  P2: 'Średniozawansowany',
  P3: 'Zaawansowany',
  P4: 'Ekspert',
} as const;

export type ReservationAdvancement =
  (typeof ReservationAdvancement)[keyof typeof ReservationAdvancement];
export const reservationAdvancement = Object.values(ReservationAdvancement);
