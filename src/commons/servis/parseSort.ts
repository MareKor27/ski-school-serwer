import { SortModel } from '../types/SortModel';

export function parseSort<F extends string = string>(
  sort: string,
): SortModel<F> {
  // const tab = sort.split(":");
  // if(tab.length==1){
  //     tab.push("ASC")
  // }

  // return {field: tab[0],direction:tab[1]}

  const [field, direction = 'ASC'] = sort.split(':');
  return { field: field as F, direction: direction as 'ASC' | 'DESC' };
}

// export function parseSort<F extends string = string>(sort: string,allowedFields?:F[]):SortModel<F>{
// return {direction:"ASC",field:"" as F}
// }

// const sort = parseSort("jakis",["Abraham","Marek"])
