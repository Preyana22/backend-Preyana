import { Model } from "mongoose";
import { Airport } from "./schemas/airports.schema";
export declare class AirportsService {
    private airportModel;
    constructor(airportModel: Model<Airport>);
    getAirports(search?: string): Promise<Airport[]>;
}
