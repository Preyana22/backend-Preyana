import { Document } from "mongoose";
export declare class Airport extends Document {
    icao_code: string;
    iata_country_code: string;
    iata_code: string;
    iata_city_code: string;
    city_name: string;
    latitude: number;
    longitude: number;
    city: string;
    time_zone: string;
    name: string;
    airport_id: string;
}
export declare const AirportSchema: import("mongoose").Schema<Airport, import("mongoose").Model<Airport, any, any>, undefined, {}>;
