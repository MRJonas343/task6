"use client";

import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPresentation } from "@/Services/createPresentation";
import { getAllSlides, ResponseGetSlidesLoby } from "@/Services/getLobySlides";
import { searchPresentations } from "@/Services/searchPresentations";
import { Footer, Gallery, ModalLoby, ToolbarHome } from ".";

export const Loby = () => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const router = useRouter();

	const [presentationId, setPresentationId] = useState("");
	const [totalPages, setTotalPages] = useState(1);
	const [isGalleryLoading, setIsGalleryLoading] = useState(true);
	const [slides, setSlides] = useState<ResponseGetSlidesLoby[]>([]);
	const [allSlides, setAllSlides] = useState<ResponseGetSlidesLoby[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isSearchMode, setIsSearchMode] = useState(false);

	const ITEMS_PER_PAGE = 12;

	// Helper function to paginate slides
	const paginateSlides = (
		slidesToPaginate: ResponseGetSlidesLoby[],
		page: number,
	) => {
		const startIndex = (page - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return slidesToPaginate.slice(startIndex, endIndex);
	};

	// Helper function to calculate total pages
	const calculateTotalPages = (totalItems: number) => {
		return Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
	};

	const onNewPresentation = () => {
		onOpen();
	};

	const onSearch = (value: string) => {
		if (!value) {
			//*reset to show all slides and enable pagination
			setIsSearchMode(false);
			const paginatedSlides = paginateSlides(allSlides, 1);
			setSlides(paginatedSlides);
			setTotalPages(calculateTotalPages(allSlides.length));
			setCurrentPage(1);
			return;
		}

		setIsSearchMode(true);

		// Search through already loaded slides
		const results = searchPresentations(value, allSlides);
		setSlides(results);
		setTotalPages(1);
		setCurrentPage(1);
	};
	const displayModal = (id: string) => {
		setPresentationId(id);
		onOpen();
	};

	const onJoinPresentation = async (
		name: string,
		id?: string,
		title?: string,
	) => {
		if (!id) {
			try {
				const result = await createPresentation(
					title ?? "Untitled Presentation",
					name,
				);

				router.push(`/presentation/${result.presentationId}/${result.creator}`);
			} catch (error) {}

			return onClose();
		}

		//*Join the presentation, before joining save the userName and the presentationId
		const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
		const response = await fetch(
			`${BASE_URL}/loby/joinPresentation/${id}/${name}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const data = await response.json();

		if (!data) return;

		onClose();
		return router.push(`/presentation/${id}/${name}`);
	};

	const onSortBy = (value: string) => {};

	const onPageChange = (page: number) => {
		if (isSearchMode) return; // Don't paginate during search

		setCurrentPage(page);
		const paginatedSlides = paginateSlides(allSlides, page);
		setSlides(paginatedSlides);
	};

	useEffect(() => {
		const loadAllSlides = async () => {
			setIsGalleryLoading(true);
			try {
				const allSlidesData = await getAllSlides();
				setAllSlides(allSlidesData);

				// Show first page
				const firstPageSlides = paginateSlides(allSlidesData, 1);
				setSlides(firstPageSlides);
				setTotalPages(calculateTotalPages(allSlidesData.length));
				setCurrentPage(1);
			} catch (error) {
				console.error("Error loading slides:", error);
				setSlides([]);
				setAllSlides([]);
				setTotalPages(1);
			} finally {
				setIsGalleryLoading(false);
			}
		};

		loadAllSlides();
	}, []);

	return (
		<div className="min-h-screen pb-20">
			<ToolbarHome
				onSortBy={onSortBy}
				onNewPresentation={onNewPresentation}
				onSearch={onSearch}
			/>
			<section className="w-[90%] sm:w-[85%] lg:w-[80%] xl:w-[75%] mx-auto mt-8 px-4">
				<Gallery
					isLoading={isGalleryLoading}
					displayModal={displayModal}
					slides={slides}
				/>
			</section>
			<ModalLoby
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				presentationId={presentationId}
				onSubmitForm={(userName, title, id) =>
					onJoinPresentation(userName, id, title)
				}
			/>
			<Footer
				page={currentPage}
				total={isSearchMode ? 1 : totalPages}
				setPage={(page) => onPageChange(page)}
			/>
		</div>
	);
};
