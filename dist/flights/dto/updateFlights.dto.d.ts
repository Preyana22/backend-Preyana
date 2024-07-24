import { User } from '../../users/user.schema';
import { Category } from '../../categories/category.schema';
export declare class UpdatePostDto {
    _id: string;
    title: string;
    content: string;
    categories: Category[];
    author: User;
}
export default UpdatePostDto;
