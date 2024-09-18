import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Double } from "bson";
import { Document } from "mongoose";

@Schema()
export class Airport extends Document {
  @Prop({ required: true })
  icao_code: string;

  @Prop({ required: true })
  iata_country_code: string;

  @Prop({ required: true })
  iata_code: string;

  @Prop({ required: true })
  iata_city_code: string;

  @Prop({ required: true })
  city_name: string;

  @Prop({ required: true })
  latitude: number; // Use 'number' type for latitude

  @Prop({ required: true })
  longitude: number; // Same for longitude, if needed

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  time_zone: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  airport_id: string;
}

export const AirportSchema = SchemaFactory.createForClass(Airport);
