import { IsString, IsNotEmpty } from 'class-validator';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  slices: string[];

  @IsString()
  @IsNotEmpty()
  cabin_class: string;

  passengers: string[];
}

export default PostDto;
