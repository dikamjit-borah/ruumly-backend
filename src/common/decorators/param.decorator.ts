/**
 * Custom parameter decorators
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get current user from JWT payload
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

/**
 * Get current user ID
 */
export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user?.userId;
});
