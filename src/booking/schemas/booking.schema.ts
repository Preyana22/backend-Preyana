import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { FlightSegment, FlightSegmentSchema } from "./flightsegment.schema"; // Adjust the import as needed

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  loginEmail: string;

  @Prop({ required: true })
  booking_id: string;

  @Prop({ required: true })
  booking_reference: string;

  @Prop({ required: true })
  offer_id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  address1: string;

  @Prop({ required: false })
  address2: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  region: string;

  @Prop({ required: false })
  postal: string;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false, default: () => new Date() })
  createdOn: Date;

  @Prop({ required: false })
  airlines: string;

  @Prop({ type: [FlightSegmentSchema], required: false }) // Use FlightSegmentSchema here
  slices: FlightSegment[];
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
