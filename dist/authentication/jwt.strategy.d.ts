import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
import UsersService from '../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userService;
    constructor(configService: ConfigService, userService: UsersService);
    validate(payload: TokenPayload): Promise<import("../users/user.schema").UserDocument>;
}
export {};
