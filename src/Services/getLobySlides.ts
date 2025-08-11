import { Dispatch, SetStateAction } from "react";

export interface ResponseGetSlidesLoby {
	presentationId: number;
	topic: string;
	creator: string;
	previewImage: string;
	numberOfParticipants: number;
}

export interface PaginationData {
	slides: ResponseGetSlidesLoby[];
	totalPages: number;
	currentPage: number;
	totalItems: number;
}

export const getAllSlides = async (): Promise<ResponseGetSlidesLoby[]> => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	try {
		// Fetch all slides (you might need to adjust this endpoint)
		const response = await fetch(`${BASE_URL}/loby/allSlides`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			const data: ResponseGetSlidesLoby[] = await response.json();
			return data;
		}

		// Fallback: try to get from the regular endpoint
		const fallbackResponse = await fetch(`${BASE_URL}/loby/slidesGallery`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				page: "1",
			},
		});

		if (fallbackResponse.ok) {
			const data: ResponseGetSlidesLoby[] = await fallbackResponse.json();
			return data;
		}

		return [];
	} catch (error) {
		console.error("Error fetching all slides:", error);
		return [];
	}
};

export const getLobySlides = async (
	page: string,
	setSlides: Dispatch<SetStateAction<ResponseGetSlidesLoby[]>>,
	setIsGalleryLoading: Dispatch<SetStateAction<boolean>>,
	setTotalPages?: Dispatch<SetStateAction<number>>,
	setAllSlides?: Dispatch<SetStateAction<ResponseGetSlidesLoby[]>>,
) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const response = await fetch(`${BASE_URL}/loby/slidesGallery`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			page: page,
		},
	});

	const data: ResponseGetSlidesLoby[] = await response.json();

	setSlides(data);

	// Store all slides for search functionality
	if (setAllSlides && page === "1") {
		setAllSlides(data);
	}

	// Calculate total pages based on current data
	// If we have data, assume there might be more pages
	// If the current page returns less than the expected items per page, it's likely the last page
	const itemsPerPage = 12; // Adjust this based on your backend pagination

	if (setTotalPages) {
		if (data.length === 0) {
			// No data, only 1 page (empty)
			setTotalPages(1);
		} else if (data.length < itemsPerPage) {
			// This is likely the last page
			const currentPageNum = parseInt(page);
			setTotalPages(currentPageNum);
		} else {
			// Full page of data, assume there might be more
			const currentPageNum = parseInt(page);
			setTotalPages(Math.max(currentPageNum + 1, 2));
		}
	}

	setIsGalleryLoading(false);
};
