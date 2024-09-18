import { Module } from "@nestjs/common";
import { AirportsService } from "./airports.service";
import { AirportsController } from "./airports.controller";
import { Airport, AirportSchema } from "./schemas/airports.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Airport.name, schema: AirportSchema }]),
  ],
  providers: [AirportsService],
  controllers: [AirportsController],
})
export class AirportsModule {}
