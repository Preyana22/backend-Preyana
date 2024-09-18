import { Document } from "mongoose";
export declare class Airport extends Document {
    name: string;
    code: string;
    city: string;
}
export declare const AirportSchema: import("mongoose").Schema<Airport, import("mongoose").Model<Airport, any, any>, undefined, {}>;
