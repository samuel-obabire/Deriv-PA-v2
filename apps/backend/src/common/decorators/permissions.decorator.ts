import { Reflector } from "@nestjs/core";
import { Permissions } from "@repo/utils";

export const RequirePermission = Reflector.createDecorator<Permissions>();
