import { AirportsService } from "./airports.service";
import { Airport } from "./schemas/airports.schema";
export declare class AirportsController {
    private readonly airportsService;
    constructor(airportsService: AirportsService);
    getFlight(search?: string): Promise<{
        data: Airport[];
        errors: any;
    }>;
}
