import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';
import { UserDocument } from '../users/user.schema';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authenticationService;
    constructor(authenticationService: AuthenticationService);
    validate(email: string, password: string): Promise<UserDocument>;
}
export {};
