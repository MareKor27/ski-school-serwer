export type CollectionResponseDto<Data> = {
  content: Data[];
  pagination: {
    page: number;
    size: number;
    lastPage: number;
    totalRows: number;
    hasNext: boolean;
    hasPrev: boolean;
    isEmpty: boolean;
    isValid: boolean;
  };
};
