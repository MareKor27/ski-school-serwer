import { Transform } from 'class-transformer';
import { parseFilter } from '../servis/parseFiltr';
import { parseSort } from '../servis/parseSort';
import { FilterModel } from '../types/FilterModel';
import { SortModel } from '../types/SortModel';

export class PaginationQueryDto {
  page: number = 1;
  size: number = 10;
  @Transform(({ value }) => value.map(parseFilter))
  filter: FilterModel[] = [];
  @Transform(({ value }) => value.map(parseSort))
  sort: SortModel[] = [];
}
