import { Document, ObjectId } from "mongoose";
import { Post } from "../flights/flights.schema";
export type UserDocument = User & Document;
export declare class User {
    _id: ObjectId;
    email: string;
    userName: string;
    fullName: string;
    password: string;
    address: string;
    name: string;
    birthDate: Date;
    gender: string;
    phoneNo: string;
    nameOnCard: string;
    billingAddress: string;
    expirationDate: Date;
    creditCardNumber?: string;
    posts: Post[];
}
declare const UserSchema: import("mongoose").Schema<Document<User, any, any>, import("mongoose").Model<Document<User, any, any>, any, any>, undefined, {}>;
export { UserSchema };
