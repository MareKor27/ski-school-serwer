import { Op, WhereOptions } from 'sequelize';
import { FilterModel } from '../types/FilterModel';

// Mapowanie operatorów
const operatorMap: Record<string, symbol> = {
  '!=': Op.ne,
  '<=': Op.lte,
  '>=': Op.gte,
  '=': Op.eq,
  '<': Op.lt,
  '>': Op.gt,
  '~': Op.like,
};

export function mapFilterToSequelizeWhere<F extends string>(
  filters: FilterModel<F>[],
): WhereOptions {
  return filters.reduce((options, filter) => {
    const { field, operator, value } = filter;
    const opSymbol = operatorMap[operator];
    if (!opSymbol) {
      return options;
    }
    const fieldConstraints = options[field as string] ?? {};
    const updatedFieldConstraints = { ...fieldConstraints, [opSymbol]: value };
    const updatedOptions = { ...options, [field]: updatedFieldConstraints };
    return updatedOptions;
  }, {} as WhereOptions);
}
