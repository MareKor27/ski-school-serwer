export type SortModel<F extends string = string> = {
  field: F;
  direction: 'ASC' | 'DESC';
};
