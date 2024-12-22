export const ChosenEquipment = {
  OwnEquipment: 'WŁASNY',
  RentedEquipment: 'WYPOŻYCZONY',
} as const;

export type ChosenEquipment =
  (typeof ChosenEquipment)[keyof typeof ChosenEquipment];
export const chosenEquipment = Object.values(ChosenEquipment);
