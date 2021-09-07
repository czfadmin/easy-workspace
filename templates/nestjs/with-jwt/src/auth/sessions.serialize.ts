
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "with-jwt/src/user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(private userService:UserService){
        super();
    }
    serializeUser(user: any, done: Function) {
        done(null,{id:user.id})
    }
    deserializeUser(payload: any, done: Function) {
        const user= this.userService.findOneById(payload.id)
        done(null,user)
    }

}