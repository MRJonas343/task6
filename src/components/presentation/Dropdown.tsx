"use client";

import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { DropdownProps } from "@/interfaces";

export const Dropdown: FC<DropdownProps> = ({
	state,
	changeStroke,
	deleteElement,
	bringToFront,
	sendToBack,
	fillElement,
}) => {
	return (
		<AnimatePresence>
			{state.isDropDownMenuOpen && state.editorMode === "cursor" && (
				<motion.div
					initial={{
						opacity: 0,
						scale: 0.5,
					}}
					animate={{
						opacity: 1,
						scale: 1,
					}}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{
						opacity: { duration: 0.3 },
						scale: { duration: 0.3 },
						ease: "easeInOut",
					}}
					style={{
						top: state.dropDownMenuY,
						left: state.dropDownMenuX,
					}}
					className="bg-[#18181b] w-40 h-auto p-2 rounded-xl absolute z-50"
				>
					<Button
						onClick={bringToFront}
						radius="sm"
						className="w-full bg-[#18181b] justify-start hover:border-1 border-gray-700"
					>
						Bring to front
					</Button>
					<Button
						onClick={sendToBack}
						radius="sm"
						className="w-full bg-[#18181b] justify-start hover:border-1 border-gray-700"
					>
						Send to back
					</Button>

					{state.clickedCanvasElement?.type === "arrow" ||
					state.clickedCanvasElement?.type === "text" ? (
						<Button
							onClick={changeStroke}
							radius="sm"
							className="w-full bg-[#18181b] justify-start hover:border-1 border-gray-700"
						>
							Change Color
						</Button>
					) : (
						<>
							<Button
								onClick={changeStroke}
								radius="sm"
								className="w-full bg-[#18181b] justify-start hover:border-1 border-gray-700"
							>
								Change Border Color
							</Button>
							<Button
								onClick={fillElement}
								radius="sm"
								className="w-full bg-[#18181b] justify-start hover:border-1 border-gray-700"
							>
								Fill with color
							</Button>
						</>
					)}

					<Button
						onClick={deleteElement}
						radius="sm"
						className="w-full text-red-500 bg-[#18181b] justify-start hover:border-1 border-gray-700"
					>
						Delete
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
