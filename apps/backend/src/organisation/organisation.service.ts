import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganisationService {
	async findById(id: string) {
		return {
			orgId: id,
			derivToken: "string",
		};
	}
}
