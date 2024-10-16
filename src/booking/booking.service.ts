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
    try {
      const createdBooking = new this.bookingModel(createBookingDto);

      // Populate the related fields
      await createdBooking
        .populate({
          path: "bookings",
          populate: {
            path: "email",
          },
        })
        .execPopulate();

      // Save the booking and return the result
      return await createdBooking.save();
    } catch (error: any) {
      // Log the error for debugging purposes
      console.error("Error creating booking:", error);

      // Handle different types of errors based on the error message or code
      if (error.name === "ValidationError") {
        throw new Error("Invalid booking data. Please check the input.");
      } else if (error.name === "MongoError" && error.code === 11000) {
        throw new Error(
          "Duplicate booking detected. A record with similar details already exists."
        );
      } else {
        // Generic error handling
        throw new Error(
          "An error occurred while creating the booking. Please try again later."
        );
      }
    }
  }

  async findAll(value: string): Promise<Booking[] | null> {
    console.log("Filtering by value:", value);
    return this.bookingModel
      .find({
        $or: [
          { email: { $regex: value, $options: "i" } },
          { loginEmail: { $regex: value, $options: "i" } },
          // Add other fields here if needed
        ],
      })
      .exec();
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).exec();
  }

  async update(id: string, updateBookingDto: any): Promise<Booking | null> {
    return this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();
  }

  async updateStatus(id: string, bookingId: string, status: string) {
    try {
      // Convert id to ObjectId if needed (if _id is ObjectId in the database)
      const objectId = new ObjectId(id);
      console.log("objectId" + objectId);
      console.log("userId" + bookingId);
      // Find booking by both _id and user_id
      const booking = await this.bookingModel.findOne({
        _id: objectId, // Ensure _id is an ObjectId
        booking_id: bookingId, // Assuming user_id is a string
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
