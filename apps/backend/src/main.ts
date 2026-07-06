import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const PORT = process.env.PORT || 5050;

	app.enableCors();

	app.enableShutdownHooks();

	await app.listen(PORT, "0.0.0.0");
}
bootstrap();
