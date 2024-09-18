import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Airport } from "./schemas/airports.schema";

@Injectable()
export class AirportsService {
  constructor(
    @InjectModel(Airport.name) private airportModel: Model<Airport>
  ) {}

  async getAirports(search?: string): Promise<Airport[]> {
    // If a search query exists, filter the airports by 'iata_code'.
    if (search) {
      return this.airportModel
        .find({
          iata_code: { $regex: search, $options: "i" }, // Case-insensitive search
        })
        .exec();
    }

    // If no search query is provided, return the full list of airports.
    return this.airportModel.find().exec();
  }
}
