import PostsService from "./flights.service";
import { PaginationParams } from "../utils/paginationParams";
export default class PostsController {
    private readonly PostsService;
    constructor(PostsService: PostsService);
    getFlight(searchQuery: string): Promise<string>;
    getAllPosts({ skip, limit, startId }: PaginationParams, searchQuery: string): Promise<void>;
    airliness(req: any): Promise<string>;
    booking(request: any): Promise<{
        data: {
            orderResponse: any;
            paymentIntentResponse: any;
        };
        errors: null;
    }>;
    confirmPayment(req: any): Promise<{
        data: any;
        errors: null;
    }>;
}
