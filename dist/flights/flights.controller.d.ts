import PostsService from './flights.service';
import { PaginationParams } from '../utils/paginationParams';
export default class PostsController {
    private readonly PostsService;
    constructor(PostsService: PostsService);
    getFlight(): Promise<string>;
    getAllPosts({ skip, limit, startId }: PaginationParams, searchQuery: string): Promise<void>;
    airliness(req: any): Promise<string>;
    booking(request: any): Promise<string>;
}