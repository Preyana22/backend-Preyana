import { Model } from "mongoose";
import { UserDocument, User } from "./user.schema";
import CreateUserDto from "./dto/createUser.dto";
import * as mongoose from "mongoose";
import RegisterDto from "src/authentication/dto/register.dto";
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
    updatePassword(email: string, password: string): Promise<mongoose.UpdateWriteOpResult | null>;
    updateUser(id: string, updateUserDto: RegisterDto): Promise<User | null>;
    update(id: string, updateBookingDto: any): Promise<User | null>;
}
export default UsersService;
