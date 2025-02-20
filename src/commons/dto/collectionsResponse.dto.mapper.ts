import { CollectionResponseDto } from './collectionResponse.dto';

export function buildCollectionsResponseDto<Data>(
  data: Data[],
  metaData: any,
): CollectionResponseDto<Data> {
  return {
    content: data,
    pagination: {
      page: metaData.page,
      size: metaData.size,
      lastPage: metaData.lastPage,
      totalRows: metaData.totalRows,
      hasNext: metaData.hasNext,
      hasPrev: metaData.hasPrev,
      isEmpty: metaData.isEmpty,
      isValid: metaData.isValid,
    },
  };
}

// export function buildCollectionsResponseDto<Data>(data: Data[]): CollectionResponseDto<Data> {
//   return {content: data}
// }
