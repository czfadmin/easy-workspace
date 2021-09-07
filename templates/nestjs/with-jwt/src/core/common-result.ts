import { HttpStatus } from '@nestjs/common';

export interface CommonResult {
  code: HttpStatus;
  message: string;
  data: any;
}
export class CommonResult implements CommonResult {
  private constructor(code: HttpStatus, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static Success(message, data): CommonResult {
    return new CommonResult(HttpStatus.OK, message, data);
  }
  static Failed(message, data): CommonResult {
    return new CommonResult(HttpStatus.BAD_REQUEST, message, data);
  }

  static UnAuthorization(message, data): CommonResult {
    return new CommonResult(HttpStatus.UNAUTHORIZED, message, data);
  }
  static Result(
    code: HttpStatus,
    message: string,
    data: any = null,
  ): CommonResult {
    return new CommonResult(code, message, data);
  }
}
