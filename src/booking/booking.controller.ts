import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { BookingService } from "./booking.service";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("createbooking")
  async create(@Body() createBookingDto: any) {
    console.log("createbooking", createBookingDto);
    try {
      console.log("createBookingDto", createBookingDto);
      // Call the service to create a booking
      const booking = await this.bookingService.create(createBookingDto);
      return {
        message: "Booking created successfully",
        booking,
      };
    } catch (error: any) {
      console.error("Error creating booking:", error);

      // Handle specific error types and return appropriate HTTP responses
      if (error.message.includes("Invalid booking data")) {
        throw new HttpException(
          "Invalid booking data. Please check the input.",
          HttpStatus.BAD_REQUEST
        );
      } else if (error.message.includes("Duplicate booking detected")) {
        throw new HttpException(
          "A booking with similar details already exists.",
          HttpStatus.CONFLICT
        );
      } else {
        // Generic error response
        throw new HttpException(
          "An unexpected error occurred while creating the booking.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  @Get("bookings/:email")
  async findAll(@Param("email") email: string) {
    const results = await this.bookingService.findAll(email);
    console.log("Bookings found:", results); // Add this line for debugging
    return results;
  }
  @Get("booking/:id")
  async findOne(@Param("id") id: string) {
    return this.bookingService.findById(id);
  }

  @Put("updatebooking/:id")
  async update(@Param("id") id: string, @Body() updateBookingDto: any) {
    const result = await this.bookingService.update(id, updateBookingDto);

    if (!result) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return {
      message: `Booking with id ${id} has been updated successfully.`,
      errors: null,
    };
  }

  @Put("updatebookingstatus/:id")
  async updateStatus(
    @Param("id") id: string,
    @Body() updateBookingDto: { booking_id: string; status: string }
  ) {
    const { booking_id, status } = updateBookingDto;

    // Call the service to update the booking status
    const result = await this.bookingService.updateStatus(
      id,
      booking_id,
      status
    );
    console.log("update status result");
    console.log(result);
    if (!result) {
      throw new NotFoundException(
        `Booking with id ${id} and booking_id ${booking_id} not found`
      );
    }

    return {
      message: `Booking with id ${id} for user_id ${booking_id} has been updated successfully.`,
      errors: null,
    };
  }

  @Delete("deletebooking/:id")
  async delete(@Param("id") id: string) {
    const result = await this.bookingService.delete(id);

    if (!result) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return {
      message: `Booking with id ${id} has been deleted successfully.`,
      errors: null,
    };
  }

  @Get("singleorder/:booking_id")
  async getSingleOrder(@Param("booking_id") booking_id: string) {
    console.log(booking_id);
    let Result = [];
    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD",
    };

    const getOrder = await fetch(
      `https://api.duffel.com/air/orders/${booking_id}`,
      {
        method: "GET",
        headers: duffelHeaders,
      }
    );

    return getOrder.json();
  }

  @Get("ordercancel/:booking_id")
  async OrderCancel(@Param("booking_id") booking_id: string) {
    console.log(booking_id);
    var data = {
      data: {
        order_id: booking_id,
      },
    };
    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD",
    };

    const getOrderCancel = await fetch(
      `https://api.duffel.com/air/order_cancellations`,
      {
        method: "POST",
        headers: duffelHeaders,
        body: JSON.stringify(data),
      }
    );

    return getOrderCancel.json();
  }

  @Get("ordercancelconfirm/:cancel_id")
  async OrderCancelConfirm(@Param("cancel_id") cancel_id: string) {
    console.log(cancel_id);

    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD",
    };

    const getOrderCancelConfirm = await fetch(
      `https://api.duffel.com/air/order_cancellations/${cancel_id}/actions/confirm`,
      {
        method: "POST",
        headers: duffelHeaders,
      }
    );

    return getOrderCancelConfirm.json();
  }
}
