import { IS_PUBLIC_KEY } from "../constrants";
import { AuthGuard } from "@nestjs/passport";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {
    constructor(private reflector: Reflector) {
        super();
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
