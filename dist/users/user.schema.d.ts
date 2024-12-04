import { Document, ObjectId } from "mongoose";
import { Post } from "../flights/flights.schema";
export type UserDocument = User & Document;
export declare class User {
    _id: ObjectId;
    email: string;
    userName: string;
    password: string;
    address: string;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    gender: string;
    phoneNo: string;
    state: string;
    zip: string;
    nameOnCard: string;
    cardNumber: string;
    billingAddress: string;
    expirationDate: Date;
    creditCardNumber?: string;
    google_id: string;
    facebook_id: string;
    posts: Post[];
}
declare const UserSchema: import("mongoose").Schema<Document<User, any, any>, import("mongoose").Model<Document<User, any, any>, any, any>, undefined, {}>;
export { UserSchema };
