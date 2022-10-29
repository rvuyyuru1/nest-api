import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as http from 'http-status';
interface responseType {
  data: any;
  message: string;
  token?: string;
  errors?: any;
  status: boolean;
  statusCode: number;
}
@Injectable()
export class UtilityService {
  public responseTransform(
    res: Response,
    statusCode: number,
    status: boolean,
    data: any,
    message?: string,
    token?: string,
    errors?: any,
  ) {
    const response: responseType = {
      data,
      errors,
      token,
      message,
      status,
      statusCode,
    };
    return res.status(statusCode).json(response);
  }
  public http_status = http;
}
