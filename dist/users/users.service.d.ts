import { Model } from "mongoose";
import { UserDocument } from "./user.schema";
import CreateUserDto from "./dto/createUser.dto";
import * as mongoose from "mongoose";
declare class UsersService {
    private userModel;
    private readonly connection;
    constructor(userModel: Model<UserDocument>, connection: mongoose.Connection);
    getByEmail(email: string): Promise<UserDocument>;
    getById(id: string): Promise<UserDocument>;
    create(userData: CreateUserDto): Promise<{
        message: string;
        user: UserDocument;
    }>;
    delete(userId: string): Promise<void>;
}
export default UsersService;
