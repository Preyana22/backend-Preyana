import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import { Exclude, Transform, Type } from "class-transformer";
import { Address, AddressSchema } from "./address.schema";
import { Post } from "../flights/flights.schema";

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  userName: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ required: false })
  address: string;

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

  @Prop({
    get: (creditCardNumber: string) => {
      if (!creditCardNumber) {
        return;
      }
      const lastFourDigits = creditCardNumber.slice(
        creditCardNumber.length - 4
      );
      return `****-****-****-${lastFourDigits}`;
    },
  })
  creditCardNumber?: string;

  @Prop({ required: false })
  google_id: string;

  @Prop({ required: false })
  facebook_id: string;

  @Type(() => Post)
  posts: Post[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ userName: "text" });

UserSchema.virtual("fullName").get(function (this: User) {
  return `${this.userName}`;
});

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

export { UserSchema };
