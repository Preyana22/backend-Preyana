"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "email-smtp.us-east-2.amazonaws.com",
            port: 587,
            secure: false,
            auth: {
                user: "AKIAZR7XQOHLCFM35Q65",
                pass: "BMIVwk4atHlHo+QYzxMdaInDXn2FKT9hOYqN3OGdTCbI",
            },
        });
    }
    async sendPasswordEmail(recipientEmail, password) {
        const mailOptions = {
            from: "authentz-no-reply@xtensible.in",
            to: recipientEmail,
            subject: "Your Account Password",
            text: `Here is your generated password: ${password}`,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log("Password email sent successfully");
        }
        catch (error) {
            console.error("Error sending email:", error);
            if (error.response.includes("550-5.4.5")) {
                throw new common_1.InternalServerErrorException("Daily user sending limit exceeded.");
            }
            throw new common_1.InternalServerErrorException("Failed to send email.");
        }
    }
    async sendResetMail(to, subject, text) {
        await this.transporter.sendMail({
            from: "authentz-no-reply@xtensible.in",
            to,
            subject,
            text,
        });
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map