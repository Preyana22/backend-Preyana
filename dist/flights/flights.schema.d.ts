import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
export declare type PostDocument = Post & Document;
export declare class Post {
    static IATAcode(IATAcode: any): (target: typeof import("./flights.service").default, propertyKey: undefined, parameterIndex: 0) => void;
    _id: ObjectId;
    IATAcode: string;
    ICAOcode: string;
    Airportname: string;
}
declare const PostSchema: mongoose.Schema<Document<Post, any, any>, mongoose.Model<Document<Post, any, any>, any, any>, undefined, {}>;
export { PostSchema };
