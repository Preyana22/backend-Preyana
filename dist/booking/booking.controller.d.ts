import { BookingService } from "./booking.service";
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: any): Promise<{
        message: string;
        booking: import("./schemas/booking.schema").Booking;
    }>;
    findAll(email: string): Promise<import("./schemas/booking.schema").Booking[] | null>;
    findOne(id: string): Promise<import("./schemas/booking.schema").Booking | null>;
    update(id: string, updateBookingDto: any): Promise<{
        message: string;
        errors: null;
    }>;
    updateStatus(id: string, updateBookingDto: {
        booking_id: string;
        status: string;
    }): Promise<{
        message: string;
        errors: null;
    }>;
    delete(id: string): Promise<{
        message: string;
        errors: null;
    }>;
    getSingleOrder(booking_id: string): Promise<any>;
    OrderCancel(booking_id: string): Promise<any>;
    OrderCancelConfirm(cancel_id: string): Promise<any>;
}
