/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest()
    if (data) {
      return request.user
        ? request.user[data]
        : undefined
    }
    return request.user || undefined
  },
)
