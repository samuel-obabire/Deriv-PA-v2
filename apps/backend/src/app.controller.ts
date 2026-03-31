import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("webhook")
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Post()
	log(@Body() body) {
		// console.log(parseDerivTransaction(body.plain));
		// console.log(body.plain);
	}
}
