import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FlightSegmentDocument = FlightSegment & Document;

@Schema()
export class FlightSegment {
  @Prop({ required: true })
  travelDate: Date;

  @Prop({ required: true })
  departTime: string;

  @Prop({ required: true })
  arrivalTime: string;

  @Prop({ required: true })
  flightDuration: string;

  // Specify 'type' as String for 'stops'
  @Prop({ type: String, required: false }) // Changed here
  stops: string | null; // Still use string | null for TypeScript definition

  @Prop({ required: true })
  departAirport: string;

  @Prop({ required: true })
  arrivalAirport: string;

  @Prop({ required: true })
  departCityName: string;

  @Prop({ required: true })
  arrivalCityName: string;
}

export const FlightSegmentSchema = SchemaFactory.createForClass(FlightSegment);
