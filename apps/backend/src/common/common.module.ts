import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters/http-exception/http-exception.filter";
import apiTokenConfig from "./guards/api-token/api-token.config";
import { ApiTokenGuard } from "./guards/api-token/api-token.guard";
import { WrapResponseInterceptor } from "./interceptors/wrap-response/wrap-response.interceptor";

@Module({
	imports: [ConfigModule.forFeature(apiTokenConfig)],
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ApiTokenGuard,
		},
	],
})
export class CommonModule {}
