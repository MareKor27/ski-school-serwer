export type ErrorResponseDto = {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path?: string;
  issues?: { field: string; message: string }[];
};
