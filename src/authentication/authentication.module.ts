import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { UsersModule } from "../users/users.module";
import { AuthenticationController } from "./authentication.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { EmailService } from "src/users/email.service";
import UsersService from "src/users/users.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from "path";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_EXPIRATION_TIME")}s`,
        },
      }),
    }),

    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "bsskk2022@gmail.com",
          pass: "vggtkmvrrddxshdc",
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: path.join(process.cwd(), "src", "templates"), // Using process.cwd() to get the absolute path
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, EmailService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
