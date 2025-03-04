import { ResponseDto } from './response.dto';

export function buildResponseDto<Data>(
  data: Data,
  message?: string,
): ResponseDto<Data> {
  return { content: data, message: message ?? null };
}
