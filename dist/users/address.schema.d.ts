import { Document } from 'mongoose';
export type AddressDocument = Address & Document;
export declare class Address {
    _id: string;
    city: string;
    street: string;
}
export declare const AddressSchema: import("mongoose").Schema<Document<Address, any, any>, import("mongoose").Model<Document<Address, any, any>, any, any>, undefined, {}>;
