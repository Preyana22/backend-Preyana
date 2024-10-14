import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking, BookingDocument } from "./schemas/booking.schema";
import { ObjectId } from "mongodb"; // Import ObjectId

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
  ) {}

  async create(createBookingDto: any): Promise<Booking> {
    const createdBooking = new this.bookingModel(createBookingDto);
    await createdBooking
      .populate({
        path: "bookings",
        populate: {
          path: "email",
        },
      })
      .execPopulate();

    return createdBooking.save();
  }

  async findAll(email: string): Promise<Booking[] | null> {
    console.log("Filtering by email:", email);
    return this.bookingModel.find({ email: email }).exec();
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).exec();
  }

  async update(id: string, updateBookingDto: any): Promise<Booking | null> {
    return this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();
  }

  async updateStatus(id: string, userId: string, status: string) {
    try {
      // Convert id to ObjectId if needed (if _id is ObjectId in the database)
      const objectId = new ObjectId(id);

      // Find booking by both _id and user_id
      const booking = await this.bookingModel.findOne({
        _id: objectId, // Ensure _id is an ObjectId
        user_id: userId, // Assuming user_id is a string
      });

      if (!booking) {
        return null; // Booking not found
      }

      // Update the status field
      booking.status = status;

      // Save the updated booking
      return await booking.save(); // Use save() to persist the changes
    } catch (error) {
      // Log or handle error if ObjectId conversion fails or other errors occur
      console.error("Error in updateStatus:", error);
      throw new Error("Failed to update booking status.");
    }
  }

  async delete(id: string): Promise<Booking | null> {
    return this.bookingModel.findByIdAndRemove(id).exec();
  }
}
