import { ResponseGetSlidesLoby } from "./getLobySlides";

export const searchPresentations = (
	searchTerm: string,
	allSlides: ResponseGetSlidesLoby[],
): ResponseGetSlidesLoby[] => {
	if (!searchTerm.trim()) {
		return allSlides;
	}

	const searchTermLower = searchTerm.toLowerCase().trim();

	// Filter slides by topic and creator (case-insensitive)
	return allSlides.filter(
		(slide: ResponseGetSlidesLoby) =>
			slide.topic.toLowerCase().includes(searchTermLower) ||
			slide.creator.toLowerCase().includes(searchTermLower),
	);
};
