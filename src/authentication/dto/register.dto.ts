import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(7)
  password: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false, default: () => new Date() })
  birthDate: Date;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  phoneNo: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false, default: () => new Date() })
  nameOnCard: string;

  @Prop({ required: false })
  billingAddress: string;

  @Prop({ required: false, default: () => new Date() })
  expirationDate: Date;
}

export default RegisterDto;
