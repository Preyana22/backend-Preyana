import { Document } from "mongoose";
export type FlightSegmentDocument = FlightSegment & Document;
export declare class FlightSegment {
    travelDate: Date;
    departTime: string;
    arrivalTime: string;
    flightDuration: string;
    stops: string | null;
    departAirport: string;
    arrivalAirport: string;
    departCityName: string;
    arrivalCityName: string;
}
export declare const FlightSegmentSchema: import("mongoose").Schema<Document<FlightSegment, any, any>, import("mongoose").Model<Document<FlightSegment, any, any>, any, any>, undefined, {}>;
