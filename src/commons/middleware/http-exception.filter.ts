import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { statusMessages } from './http-status-messages';
import { UniqueConstraintError } from 'sequelize';

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

    let error = 'Internal Server Error';
    if (typeof exceptionResponse.error === 'string') {
      error = exceptionResponse.error;
    }

    let issues: { field: string; message: string }[] = [];

    if (exceptionResponse.message) {
      if (Array.isArray(exceptionResponse.message)) {
        issues = exceptionResponse.message.map((msg) => ({
          field: msg.property,
          message: Object.values(msg.constraints || {}).join(', '),
        }));
      }
    }
    const message = statusMessages[status];

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

// @Catch(UniqueConstraintError)
// export class UniqueConstraintExceptionFilter implements ExceptionFilter {
//   catch(exception: UniqueConstraintError, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest<Request>();
//     const status = HttpStatus.BAD_REQUEST;

//     console.log(exception);

//     let issues: { field: string; message: string }[] = [];

//     if (exception?.fields?.email) {
//       issues.push({ field: 'email', message: 'Email jest już używany' });
//     }

//     const newIssue = { field: 'email', message: 'Email jest już używany' };

//     issues = issues ? [...issues, newIssue] : [newIssue];

//     // const message = exception.message;

//     // const emailRegex = /"([^"]+)_email_key"/;
//     // const match = message.match(emailRegex);

//     // if (match && match[1]) {
//     //   issues.push({ field: 'email', message: 'Email jest już używany' });
//     // }

//     const errorResponse: ErrorResponseDto = {
//       statusCode: status,
//       message: 'Unique constraint violation',
//       error: 'Bad Request',
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       issues,
//     };

//     response.status(status).json(errorResponse);
//   }
// }
