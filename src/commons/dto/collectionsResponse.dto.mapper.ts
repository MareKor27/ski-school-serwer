import { BuildCollectionsResponseDtoMetaData } from '../types/buildCollectionsResponseDtoMetaData';
import { CollectionResponseDto } from './collectionResponse.dto';

export function buildCollectionsResponseDto<Data>(
  data: Data[],
  metaData: BuildCollectionsResponseDtoMetaData,
): CollectionResponseDto<Data> {
  const lastPage = Math.ceil(metaData.totalRows / metaData.size);
  const hasNext = metaData.page < lastPage;
  const hasPrev = metaData.page > 1;
  const isEmpty = data.length == 0;
  const isValid = metaData.page <= lastPage && metaData.page >= 1;
  return {
    content: data,
    pagination: {
      page: metaData.page,
      size: metaData.size,
      totalRows: metaData.totalRows,
      lastPage,
      hasNext,
      hasPrev,
      isEmpty,
      isValid,
    },
  };
}

// export function buildCollectionsResponseDto<Data>(data: Data[]): CollectionResponseDto<Data> {
//   return {content: data}
// }
