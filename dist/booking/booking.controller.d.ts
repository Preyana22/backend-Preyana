import { BookingService } from "./booking.service";
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: any): Promise<import("./schemas/booking.schema").Booking>;
    findAll(email: string): Promise<import("./schemas/booking.schema").Booking[] | null>;
    findOne(id: string): Promise<import("./schemas/booking.schema").Booking | null>;
    update(id: string, updateBookingDto: any): Promise<{
        message: string;
        errors: null;
    }>;
    updateStatus(id: string, updateBookingDto: {
        user_id: string;
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
