import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Transform, Type } from 'class-transformer';
import { Category } from '../categories/category.schema';
import { Series } from '../series/series.schema';

export type PostDocument = Post & Document;

@Schema({ collection: 'airports' })
export class Post {
  static IATAcode(IATAcode: any): (target: typeof import("./flights.service").default, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error('Method not implemented.');
  }
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  
  IATAcode: string;

  ICAOcode: string;

  Airportname: string;


}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ title: 'text', content: 'text' });

export { PostSchema };
