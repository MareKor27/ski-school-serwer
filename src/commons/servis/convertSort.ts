import { Order } from 'sequelize';
import { SortModel } from '../types/SortModel';

export function mapSortToSequelizeOrder<F extends string>(
  sorts: SortModel<F>[],
): Order {
  return sorts.map((tab) => [tab.field, tab.direction]);
}
