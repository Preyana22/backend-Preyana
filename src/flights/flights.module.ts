import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import PostsController from "./flights.controller";
import PostsService from "./flights.service";
import { Post, PostSchema } from "./flights.schema";
import { AirportsModule } from './airports/airports.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AirportsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
class PostsModule {}

export default PostsModule;
