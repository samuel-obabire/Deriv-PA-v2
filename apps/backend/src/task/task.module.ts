import { Module } from "@nestjs/common";
import { DerivModule } from "src/deriv/deriv.module";
import { TasksService } from "./task.service";

@Module({
	imports: [DerivModule],
	providers: [TasksService],
})
export class TaskModule {}
