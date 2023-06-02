import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtServ: JwtService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      if (!req.headers.authorization) return false;
      const token = req.headers.authorization.split(" ")[1];
      const payload = this.jwtServ.verify(token);
      req.user = payload;
      if (payload) {
        return true;
      }
      return false;
    } catch (err) {
      console.log("ERROR IN AUTH GUARD: ", err);
      return false;
    }
  }
}
