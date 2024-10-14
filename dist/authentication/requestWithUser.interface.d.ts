/// <reference types="cookie-parser" />
import { Request } from 'express';
import { UserDocument } from '../users/user.schema';
interface RequestWithUser extends Request {
    user: UserDocument;
}
export default RequestWithUser;
