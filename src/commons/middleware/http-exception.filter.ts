import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { statusMessages } from './http-status-messages';

type ValidationIssue = {
  property: string;
  constraints?: { [type: string]: string };
};

type ExceptionResponseShape = {
  message?: string | ValidationIssue[];
  error?: string;
  [key: string]: unknown;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ExceptionResponseShape;

    let message = 'An unexpected error occurred';
    let error = 'Internal Server Error';
    let issues: { field: string; message: string }[] | undefined = undefined;

    if (exceptionResponse.message) {
      if (Array.isArray(exceptionResponse.message)) {
        message = 'Validation failed';
        issues = exceptionResponse.message.map((msg) => ({
          field: msg.property,
          message: Object.values(msg.constraints || {}).join(', '),
        }));
      } else if (typeof exceptionResponse.message === 'string') {
        message = exceptionResponse.message;
      }
    }
    message = statusMessages[status];

    /// słownik i sprawdzanie po kluczach
    if (typeof exceptionResponse.error === 'string') {
      error = exceptionResponse.error;
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      issues,
    };

    response.status(status).json(errorResponse);
  }
}
