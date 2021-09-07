import { IS_PUBLIC_KEY } from "../constrants";
import { AuthGuard } from "@nestjs/passport";
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private reflector: Reflector) {
        super();
    }
    async canActivate(
        context: ExecutionContext
    ) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) {
            return true;
        }
        return await super.canActivate(context) as boolean
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
