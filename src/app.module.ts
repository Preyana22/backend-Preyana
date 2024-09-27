import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import PostsModule from "./flights/flights.module";
import * as Joi from "@hapi/joi";
import { AuthenticationModule } from "./authentication/authentication.module";
import { BookingModule } from "./booking/booking.module";
import CategoriesModule from "./categories/categories.module";
import { AirportsModule } from "./flights/airports/airports.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // const username = configService.get("MONGO_USERNAME");
        // const password = configService.get("MONGO_PASSWORD");
        // const database = "admin";
        // const host = "127.0.0.1" || configService.get("MONGO_HOST");

        return {
          uri: `mongodb://127.0.0.1:27017/`,
          dbName: "admin",
        };
      },
      inject: [ConfigService],
    }),
    PostsModule,
    AuthenticationModule,
    CategoriesModule,
    BookingModule,
    AirportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
