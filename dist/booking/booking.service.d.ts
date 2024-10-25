import { Model } from "mongoose";
import { Booking, BookingDocument } from "./schemas/booking.schema";
export declare class BookingService {
    private bookingModel;
    constructor(bookingModel: Model<BookingDocument>);
    create(createBookingDto: any): Promise<Booking>;
    findAll(email: string, keyword?: string, upcoming?: boolean): Promise<BookingDocument[] | null>;
    findById(id: string): Promise<Booking | null>;
    update(id: string, updateBookingDto: any): Promise<Booking | null>;
    updateStatus(id: string, bookingId: string, status: string): Promise<BookingDocument | null>;
    delete(id: string): Promise<Booking | null>;
}
