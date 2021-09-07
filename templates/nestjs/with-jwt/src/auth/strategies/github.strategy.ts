import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import { AuthService } from "../auth.service";
import { Strategy, StrategyOptions } from "passport-github2";
import * as oauth2 from "passport-oauth2";
import express from "express";
import passport from "passport";
const GITHUB_CLIENT_ID = "f179ffb9540eb072ccaa";
const GITHUB_CLIENT_SECRET = "ce74cafd1d99f7eeb4dfa1190324b464fdb3cb00";
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor(private moduleRef: ModuleRef) {
        super(
            <StrategyOptions>{
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: "http://localhost:3200/api/auth/callback",
                tokenURL: "",
                scope: ["user:email"],
                passReqToCallback: false,
            },
            (
                accessToken: string,
                refreshToken: string,
                profile: any,
                done: oauth2.VerifyCallback
            ) => {
                console.log(accessToken);
                done(null, null);
            }
        );
    }

    async validate(request, username: string, password: string): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        const authService = await this.moduleRef.resolve(
            AuthService,
            contextId
        );
        const user = await authService.validateAccount(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
    authenticate(req: express.Request, options?: passport.AuthenticateOptions) {
        super.authenticate(req, options);
    }
}
