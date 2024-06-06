import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../../users/user.schema';
import { Exclude, Type } from 'class-transformer';
import { Category } from '../../categories/category.schema';


export class UpdatePostDto {
  @IsOptional()
  @Exclude()
  _id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @Type(() => Category)
  categories: Category[];

  @Type(() => User)
  @IsNotEmpty()
  author: User;

 
}

export default UpdatePostDto;
