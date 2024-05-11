import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PostsController from './flights.controller';
import PostsService from './flights.service';
import { Post, PostSchema } from './flights.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService]

})
class PostsModule {}

export default PostsModule;
