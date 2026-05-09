import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters/http-exception/http-exception.filter";
import { WrapResponseInterceptor } from "./interceptors/wrap-response/wrap-response.interceptor";

@Module({
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class CommonModule {}
