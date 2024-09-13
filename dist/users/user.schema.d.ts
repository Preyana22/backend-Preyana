import { Document, ObjectId } from 'mongoose';
import { Address } from './address.schema';
import { Post } from '../flights/flights.schema';
export type UserDocument = User & Document;
export declare class User {
    _id: ObjectId;
    email: string;
    userName: string;
    fullName: string;
    password: string;
    address: Address;
    creditCardNumber?: string;
    posts: Post[];
}
declare const UserSchema: import("mongoose").Schema<Document<User, any, any>, import("mongoose").Model<Document<User, any, any>, any, any>, undefined, {}>;
export { UserSchema };
