import { Module } from "@nestjs/common";
import { DerivModule } from "src/deriv/deriv.module";
import { DerivGatewayModule } from "src/deriv-gateway/deriv-gateway.module";
import { TasksService } from "./task.service";

@Module({
	imports: [DerivModule, DerivGatewayModule],
	providers: [TasksService],
})
export class TaskModule {}
