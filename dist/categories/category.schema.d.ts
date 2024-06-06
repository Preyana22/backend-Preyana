import { Document, ObjectId } from 'mongoose';
export declare type CategoryDocument = Category & Document;
export declare class Category {
    _id: ObjectId;
    name: string;
}
export declare const CategorySchema: import("mongoose").Schema<Document<Category, any, any>, import("mongoose").Model<Document<Category, any, any>, any, any>, undefined, {}>;
