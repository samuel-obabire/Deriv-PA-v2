import slugify from "slugify";

export const slugifyString = (string: string) => {
	return slugify(string, {
		remove: /[*+~.()'"!:@]/g,
		lower: true,
		trim: true,
	});
};
