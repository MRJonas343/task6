import { Pagination } from "@nextui-org/pagination";
import { FC } from "react";

interface FooterProps {
	total: number;
	page: number;
	setPage: (page: number) => void;
}

export const Footer: FC<FooterProps> = ({ total, page, setPage }) => {
	// Only show pagination if there's more than 1 page
	if (total <= 1) {
		return null;
	}

	return (
		<footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-700 py-4">
			<div className="flex justify-center w-full px-4">
				<Pagination
					siblings={1}
					showControls
					showShadow
					total={total}
					page={page}
					onChange={(newPage) => setPage(newPage)}
					size="sm"
					className="sm:hidden"
				/>
				<Pagination
					siblings={2}
					showControls
					showShadow
					total={total}
					page={page}
					onChange={(newPage) => setPage(newPage)}
					size="md"
					className="hidden sm:flex lg:hidden"
				/>
				<Pagination
					siblings={3}
					showControls
					showShadow
					total={total}
					page={page}
					onChange={(newPage) => setPage(newPage)}
					size="lg"
					className="hidden lg:flex"
				/>
			</div>
		</footer>
	);
};
