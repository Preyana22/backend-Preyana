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
} from "@nestjs/common";
import { BookingService } from "./booking.service";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("createbooking")
  async create(@Body() createBookingDto: any) {
    console.log("createBookingDto", createBookingDto);
    return this.bookingService.create(createBookingDto);
  }

  @Get("bookings/:user_id")
  async findAll(@Param("user_id") user_id: string) {
    const results = await this.bookingService.findAll(user_id);
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
    @Body() updateBookingDto: { user_id: string; status: string }
  ) {
    const { user_id, status } = updateBookingDto;

    // Call the service to update the booking status
    const result = await this.bookingService.updateStatus(id, user_id, status);

    if (!result) {
      throw new NotFoundException(
        `Booking with id ${id} and user_id ${user_id} not found`
      );
    }

    return {
      message: `Booking with id ${id} for user_id ${user_id} has been updated successfully.`,
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
