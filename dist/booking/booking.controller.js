"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const mailer_1 = require("@nestjs-modules/mailer");
let BookingController = class BookingController {
  constructor(bookingService, mailerService) {
    this.bookingService = bookingService;
    this.mailerService = mailerService;
  }
  async create(createBookingDto) {
    console.log("createbooking", createBookingDto);
    try {
      const booking = await this.bookingService.create(createBookingDto);
      const confirmation = await this.sendBookingConfirmation(booking);
      return {
        message: "Booking created successfully",
        booking,
      };
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error.message.includes("Invalid booking data")) {
        throw new common_1.HttpException(
          "Invalid booking data. Please check the input.",
          common_1.HttpStatus.BAD_REQUEST
        );
      } else if (error.message.includes("Duplicate booking detected")) {
        throw new common_1.HttpException(
          "A booking with similar details already exists.",
          common_1.HttpStatus.CONFLICT
        );
      } else {
        throw new common_1.HttpException(
          "An unexpected error occurred while creating the booking.",
          common_1.HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
  async findAll(email, keyword, upcoming) {
    try {
      if (!email || !this.isValidEmail(email)) {
        throw new common_1.HttpException(
          "Invalid email format.",
          common_1.HttpStatus.BAD_REQUEST
        );
      }
      const results = await this.bookingService.findAll(
        email,
        keyword,
        upcoming
      );
      console.log("Bookings found:", results);
      return results;
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
      throw new common_1.HttpException(
        "Failed to fetch bookings. Please try again later.",
        common_1.HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  async findOne(id) {
    return this.bookingService.findById(id);
  }
  async update(id, updateBookingDto) {
    const result = await this.bookingService.update(id, updateBookingDto);
    if (!result) {
      throw new common_1.NotFoundException(`Booking with id ${id} not found`);
    }
    return {
      message: `Booking with id ${id} has been updated successfully.`,
      errors: null,
    };
  }
  async updateStatus(id, updateBookingDto) {
    const { booking_id, status } = updateBookingDto;
    const result = await this.bookingService.updateStatus(
      id,
      booking_id,
      status
    );
    console.log("update status result");
    console.log(result);
    if (!result) {
      throw new common_1.NotFoundException(
        `Booking with id ${id} and booking_id ${booking_id} not found`
      );
    }
    return {
      message: `Booking with id ${id} for user_id ${booking_id} has been updated successfully.`,
      errors: null,
    };
  }
  async delete(id) {
    const result = await this.bookingService.delete(id);
    if (!result) {
      throw new common_1.NotFoundException(`Booking with id ${id} not found`);
    }
    return {
      message: `Booking with id ${id} has been deleted successfully.`,
      errors: null,
    };
  }
  async getSingleOrder(booking_id) {
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
  async OrderCancel(booking_id) {
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
  async OrderCancelConfirm(cancel_id) {
    console.log(cancel_id);
    const duffelHeaders = {
      "Duffel-Version": "v1",
      "Accept-Encoding": "gzip",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer duffel_live_iVxhZcQG0tlGfWgY9aq4ZuRCV-m4GwIDGmljueNXgKq",
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
  async sendBookingConfirmation(booking) {
    var _a, _b;
    try {
      await this.mailerService.sendMail({
        to: booking.email,
        subject: "Booking Confirmation",
        template: "../templates/booking-confirmation",
        context: {
          name: booking.name,
          booking_reference: booking.booking_reference,
          airlines: booking.airlines,
          travel_date:
            (_a = booking.slices[0]) === null || _a === void 0
              ? void 0
              : _a.travelDate,
          flight_duration:
            (_b = booking.slices[0]) === null || _b === void 0
              ? void 0
              : _b.flightDuration,
        },
      });
      console.log("Booking confirmation email sent successfully.");
    } catch (error) {
      console.error("Error sending booking confirmation email:", error);
      throw new Error("Failed to send booking confirmation email.");
    }
  }
};
__decorate(
  [
    (0, common_1.Post)("createbooking"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "create",
  null
);
__decorate(
  [
    (0, common_1.Get)("bookings"),
    __param(0, (0, common_1.Query)("email")),
    __param(1, (0, common_1.Query)("keyword")),
    __param(2, (0, common_1.Query)("upcoming")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "findAll",
  null
);
__decorate(
  [
    (0, common_1.Get)("booking/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "findOne",
  null
);
__decorate(
  [
    (0, common_1.Put)("updatebooking/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "update",
  null
);
__decorate(
  [
    (0, common_1.Put)("updatebookingstatus/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "updateStatus",
  null
);
__decorate(
  [
    (0, common_1.Delete)("deletebooking/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "delete",
  null
);
__decorate(
  [
    (0, common_1.Get)("singleorder/:booking_id"),
    __param(0, (0, common_1.Param)("booking_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "getSingleOrder",
  null
);
__decorate(
  [
    (0, common_1.Get)("ordercancel/:booking_id"),
    __param(0, (0, common_1.Param)("booking_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "OrderCancel",
  null
);
__decorate(
  [
    (0, common_1.Get)("ordercancelconfirm/:cancel_id"),
    __param(0, (0, common_1.Param)("cancel_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  BookingController.prototype,
  "OrderCancelConfirm",
  null
);
BookingController = __decorate(
  [
    (0, common_1.Controller)("booking"),
    __metadata("design:paramtypes", [
      booking_service_1.BookingService,
      mailer_1.MailerService,
    ]),
  ],
  BookingController
);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map
