import { FilterModel } from '../types/FilterModel';

const operators = ['!=', '<=', '>=', '=', '<', '>', '~'];

const filterPattern = new RegExp(
  `^(?<field>[\\w\\.]+)(?<operator>${operators.join('|')})(?<value>.+)$`,
);

export function parseFilter<F extends string>(
  filter: string,
): FilterModel<F> | null {
  const match = filter.match(filterPattern);
  if (match == null) return null;

  return {
    field: match.groups!['field'] as F,
    operator: match.groups!['operator'],
    value: match.groups!['value'],
  };
}
