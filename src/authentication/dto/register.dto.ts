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
  firstName: string;

  @Prop({ required: false })
  middleName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  phoneNo: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  zip: string;

  @Prop({ required: false })
  nameOnCard: string;

  @Prop({ required: false })
  cardNumber: string;

  @Prop({ required: false })
  billingAddress: string;

  @Prop({ required: false })
  expirationDate: Date;

  @Prop({ required: false })
  google_id: string;
}

export default RegisterDto;
