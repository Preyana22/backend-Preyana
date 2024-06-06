import { Model } from 'mongoose';
import { CategoryDocument } from './category.schema';
import CategoryDto from './dto/category.dto';
import { User } from '../users/user.schema';
declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    findAll(): Promise<CategoryDocument[]>;
    findOne(id: string): Promise<CategoryDocument>;
    create(categoryData: CategoryDto, author: User): Promise<CategoryDocument>;
    update(id: string, categoryData: CategoryDto): Promise<CategoryDocument>;
    delete(categoryId: string): Promise<void>;
}
export default CategoriesService;
