"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const cors_ts_1 = require("cors-ts");
async function bootstrap() {
  const app = await core_1.NestFactory.create(app_module_1.AppModule);
  app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.use(
    (0, cors_ts_1.default)({
      origin: [
        "http://localhost:3001",
        "http://52.14.78.149",
        "http://192.168.1.92:3001",
        "http://preyana.com",
      ],
      optionsSuccessStatus: 200,
    })
  );
  await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
