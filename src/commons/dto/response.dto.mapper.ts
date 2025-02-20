import { ResponseDto } from './response.dto';

export function buildResponseDto<Data>(data: Data): ResponseDto<Data> {
  return { content: data };
}
