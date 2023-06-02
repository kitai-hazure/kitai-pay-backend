import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlcontext = GqlExecutionContext.create(ctx);
    const { req } = gqlcontext.getContext();
    return req.user;
  }
);
