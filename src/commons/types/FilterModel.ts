import { ChosenEquipment } from 'src/reservations/types/chosenEquipment';

export type FilterModel<F extends string = string> = {
  field: F;
  operator: string; //OpTypes
  value: string | number | ChosenEquipment;
};
