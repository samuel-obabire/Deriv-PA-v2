import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationService {
	async findById(id: string) {
		return {
			orgId: id,
			derivToken: "string",
		};
	}
}
