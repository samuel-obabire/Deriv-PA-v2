import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { catchError, map, of } from "rxjs";

@Injectable()
export class WebhookAlwaysOkInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			map(() => {
				return { status: "ok" }; // always return success response
			}),
			catchError((err) => {
				console.error("Webhook error:", err);

				// swallow error and still return OK
				return of({ status: "ok" });
			}),
		);
	}
}
