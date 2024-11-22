import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking, BookingDocument } from "./schemas/booking.schema";
import { ObjectId } from "mongodb"; // Import ObjectId
import { FilterQuery } from "mongoose"; // Assuming you are using Mongoose
import { FlightSegment } from "./schemas/flightsegment.schema";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
  ) {}

  async create(createBookingDto: any): Promise<Booking> {
    try {
      const bookingDetails = {
        name: createBookingDto.name,
        email: createBookingDto.email,
        loginEmail: createBookingDto.loginEmail,
        booking_id: createBookingDto.booking_id,
        booking_reference: createBookingDto.booking_reference,
        offer_id: createBookingDto.offer_id,
        status: createBookingDto.status,
        address1: createBookingDto.address1,
        address2: createBookingDto.address2,
        city: createBookingDto.city,
        region: createBookingDto.region,
        postal: createBookingDto.postal,
        country: createBookingDto.country,
        airlines: createBookingDto.airlines,
        slices: [] as FlightSegment[], // Initialize as an array of FlightSegment
      };

      // Process each slice
      const slices = createBookingDto.slices || [];

      slices.forEach((slice: any) => {
        bookingDetails.slices.push({
          travelDate: slice.travelDate,
          departTime: slice.departTime,
          arrivalTime: slice.arrivalTime,
          flightDuration: slice.flightDuration,
          stops: slice.stops,
          departAirport: slice.departAirport,
          arrivalAirport: slice.arrivalAirport,
          departCityName: slice.departCityName,
          arrivalCityName: slice.arrivalCityName,
        });
      });
      // Create a new booking instance
      try {
        const createdBooking = new this.bookingModel(bookingDetails);
        console.log("createdBooking", createdBooking);
        // Populate related fields if necessary
        await createdBooking
          .populate({
            path: "bookings",
            populate: {
              path: "email",
            },
          })
          .execPopulate();

        // Save and return the created booking
        return await createdBooking.save();
      } catch (error: any) {
        console.error("Error while saving booking:", error);
        throw new Error("Failed to save booking details. Please try again.");
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error creating booking:", error);
      if (error.name === "ValidationError") {
        throw new Error("Invalid booking data. Please check the input.");
      } else if (error.name === "MongoError" && error.code === 11000) {
        throw new Error(
          "Duplicate booking detected. A record with similar details already exists."
        );
      } else {
        throw new Error(
          "An error occurred while creating the booking. Please try again later."
        );
      }
    }
  }

  async findAll(
    email: string, // This email is now directly taken from the @Query
    keyword?: string,
    upcoming?: boolean
  ): Promise<BookingDocument[] | null> {
    try {
      // Log the email filtering
      console.log("Filtering by email:", email);

      // Construct the initial filter based on the email
      const filter: FilterQuery<BookingDocument> = {
        $or: [
          { email: { $regex: `^${email}$`, $options: "i" } },
          { loginEmail: { $regex: `^${email}$`, $options: "i" } },
        ],
      };

      // Add a separate keyword filter if provided (not combined with email)
      if (keyword) {
        console.log("Keyword provided:", keyword);
        filter.$and = [
          ...(filter.$and || []), // Ensure $and is initialized if not already
          {
            $or: [
              { booking_reference: { $regex: keyword, $options: "i" } },
              { name: { $regex: keyword, $options: "i" } },
              { airlines: { $regex: keyword, $options: "i" } },
              {
                slices: {
                  $elemMatch: {
                    arrivalAirport: { $regex: keyword, $options: "i" },
                  },
                },
              },
              {
                slices: {
                  $elemMatch: {
                    departAirport: { $regex: keyword, $options: "i" },
                  },
                },
              },
              {
                slices: {
                  $elemMatch: {
                    departCityName: { $regex: keyword, $options: "i" },
                  },
                },
              },
              {
                slices: {
                  $elemMatch: {
                    arrivalCityName: { $regex: keyword, $options: "i" },
                  },
                },
              },
            ],
          },
        ];
      }

      // Add date-based filtering for upcoming or past bookings
      if (upcoming !== undefined) {
        const currentDate = new Date();

        // Create a date object for the start of today
        const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));

        filter["slices"] = {
          $elemMatch: {
            travelDate: upcoming
              ? { $gte: startOfToday } // For upcoming bookings
              : { $lt: startOfToday }, // For past bookings
          },
        };
      }

      // Define the sort criteria (descending order for travelDate)
      const sortCriteria = { "slices.travelDate": -1 };

      // Execute the query with the constructed filter and sorting
      return await this.bookingModel.find(filter).sort(sortCriteria).exec();
    } catch (error: any) {
      console.error("Error in findAll service method:", error.message);
      throw new InternalServerErrorException("Error retrieving bookings");
    }
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
