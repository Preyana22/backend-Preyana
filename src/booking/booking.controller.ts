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
  InternalServerErrorException,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import * as nodemailer from "nodemailer";
import { MailerService } from "@nestjs-modules/mailer";

@Controller("booking")
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly mailerService: MailerService
  ) {}

  @Post("createbooking")
  async create(@Body() createBookingDto: any) {
    console.log("createbooking", createBookingDto);
    try {
      // Call the service to create a booking
      const booking = await this.bookingService.create(createBookingDto);

      // Send booking confirmation email
      try {
        await this.sendBookingConfirmation(booking);
      } catch (emailError: any) {
        console.error("Error sending confirmation email:", emailError.message);
        throw new InternalServerErrorException(
          "Booking created, but failed to send confirmation email."
        );
      }

      return {
        message: "Booking created successfully, confirmation email sent.",
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
        throw new HttpException(
          "An unexpected error occurred while creating the booking.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  @Get("bookings") // This will match the email parameter in the query string
  async findAll(
    @Query("email") email: string,
    @Query("keyword") keyword?: string,
    @Query("upcoming") upcoming?: boolean
  ) {
    try {
      // Validate email format
      if (!email || !this.isValidEmail(email)) {
        throw new HttpException(
          "Invalid email format.",
          HttpStatus.BAD_REQUEST
        );
      }

      const results = await this.bookingService.findAll(
        email,
        keyword,
        upcoming
      );

      console.log("Bookings found:", results); // Debugging
      return results;
    } catch (error: any) {
      console.error("Error fetching bookings:", error.message); // Log the error
      throw new HttpException(
        "Failed to fetch bookings. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Helper function to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
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
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
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

  @Get("ordercancelconfirm/:cancel_id/:email")
  async OrderCancelConfirm(
    @Param("cancel_id") cancel_id: string,
    @Param("email") email: string
  ) {
    console.log("Cancel ID:", cancel_id);
    console.log("Email:", email);

    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
    };

    try {
      // Fetch Duffel API confirmation
      const getOrderCancelConfirm = await fetch(
        `https://api.duffel.com/air/order_cancellations/${cancel_id}/actions/confirm`,
        {
          method: "POST",
          headers: duffelHeaders,
        }
      );

      // Parse response only ONCE
      const confirmationResponse = await getOrderCancelConfirm.json();

      // Ensure data exists in response
      if (!confirmationResponse || !confirmationResponse.data) {
        throw new Error("Invalid response from Duffel API.");
      }

      const { refund_to, refund_currency, refund_amount, order_id } =
        confirmationResponse.data;

      // Send cancellation email
      try {
        await this.sendCancellationEmail(email, cancel_id, {
          refund_to,
          refund_currency,
          refund_amount,
          order_id,
        });
        console.log(`Cancellation email sent to ${email}`);
      } catch (error: any) {
        console.error("Error sending cancellation email:", error.message);
        throw new InternalServerErrorException(
          "Failed to send cancellation email. Please try again later."
        );
      }

      // ✅ Return the already parsed response
      return confirmationResponse;
    } catch (error: any) {
      console.error("Error confirming cancellation:", error.message);
      throw new InternalServerErrorException(
        "Failed to confirm cancellation. Please try again later."
      );
    }
  }

  private async sendBookingConfirmation(booking: any) {
    try {
      // Send the email
      await this.mailerService.sendMail({
        to: booking.email,
        subject: "Booking Confirmation",
        template: "../templates/booking-confirmation", // Path to your email template
        context: {
          name: booking.name,
          booking_reference: booking.booking_reference,
          airlines: booking.airlines,
          travel_date: booking.slices[0]?.travelDate,
          flight_duration: booking.slices[0]?.flightDuration,
        },
      });

      console.log("Booking confirmation email sent successfully.");
    } catch (error: any) {
      console.error("Error sending booking confirmation email:", error);
      throw new Error("Failed to send booking confirmation email.");
    }
  }

  private async sendCancellationEmail(
    email: any,
    cancel_id: any,
    canceldetail: {
      refund_to: string;
      refund_currency: string;
      refund_amount: string;
      order_id: string;
    }
  ) {
    console.log("canceldetail", canceldetail);
    const { refund_to, refund_currency, refund_amount, order_id } =
      canceldetail;
    try {
      // Send the email
      await this.mailerService.sendMail({
        to: email,
        subject: "Booking Cancellation",
        template: "../templates/booking-cancellation", // Path to your email template
        context: {
          name: email,
          cancel_id: cancel_id,
          refund_to: refund_to,
          refund_currency: refund_currency,
          refund_amount: refund_amount,
          order_id: order_id,
        },
      });

      console.log("Booking cancellation email sent successfully.");
    } catch (error: any) {
      console.error("Error sending booking confirmation email:", error);
      throw new Error("Failed to send booking confirmation email.");
    }
  }
}
