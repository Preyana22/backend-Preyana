import CategoriesService from './categories.service';
import ParamsWithId from '../utils/paramsWithId';
import CategoryDto from './dto/category.dto';
import RequestWithUser from '../authentication/requestWithUser.interface';
export default class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAllCategories(): Promise<import("./category.schema").CategoryDocument[]>;
    getCategory({ id }: ParamsWithId): Promise<import("./category.schema").CategoryDocument>;
    createCategory(category: CategoryDto, req: RequestWithUser): Promise<import("./category.schema").CategoryDocument>;
    deleteCategory({ id }: ParamsWithId): Promise<void>;
    updateCategory({ id }: ParamsWithId, category: CategoryDto): Promise<import("./category.schema").CategoryDocument>;
}
