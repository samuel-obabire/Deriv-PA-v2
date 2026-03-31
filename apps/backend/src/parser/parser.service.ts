import { Injectable } from "@nestjs/common";
import { parseDerivEmail } from "src/common/utils/deriv-parser";
import { parseMoniepointEmail } from "src/common/utils/moniepoint-parser";

@Injectable()
export class ParserService {
	moniepointParser(plainText: string) {
		return parseMoniepointEmail(plainText);
	}

	derivParser(plainText: string) {
		return parseDerivEmail(plainText);
	}
}
