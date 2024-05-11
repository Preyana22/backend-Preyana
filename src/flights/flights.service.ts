import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './flights.schema';
import { NotFoundException } from '@nestjs/common';
import PostDto from './dto/flights.dto';
import { User } from '../users/user.schema';
import * as mongoose from 'mongoose';
import UpdatePostDto from './dto/updateFlights.dto';

@Injectable()
class PostsService {
  
}

export default PostsService;
