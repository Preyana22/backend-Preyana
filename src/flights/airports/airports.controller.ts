import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { AirportsService } from "./airports.service";
import { Airport } from "./schemas/airports.schema";

@Controller("airports")
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get()
  @Get()
  async getFlight(
    @Query("search") search?: string
  ): Promise<{ data: Airport[]; errors: any }> {
    try {
      const airports = await this.airportsService.getAirports(search);
      return {
        data: airports,
        errors: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Error retrieving airports data.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
