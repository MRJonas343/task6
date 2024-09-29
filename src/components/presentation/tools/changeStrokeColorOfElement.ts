import { Action } from "@/interfaces";
import { clearCanvas } from "./clearCanvas";
import { initialState } from "../state";
import { RefObject } from "react";
import { updateCanvasElements } from "@/sockets";
import { createThumbnailImageInJPG } from "@/Services";

export const changeStrokeColorOfElement = (
	state: typeof initialState,
	ctx: CanvasRenderingContext2D | undefined | null,
	canvasRef: RefObject<HTMLCanvasElement>,
	dispatch: (value: Action) => void,
) => {
	if (!state.clickedCanvasElement) return;

	const newElement = {
		...state.clickedCanvasElement,
		color: state.selectedStrokeColor,
	};

	const newElements = state.drawnElements.map((element) => {
		if (element.id === newElement.id) {
			return newElement;
		}
		return element;
	});

	dispatch({
		type: "SET_DRAWN_ELEMENTS",
		payload: newElements,
	});
	const image = createThumbnailImageInJPG(canvasRef, ctx);

	if (!image) return;

	updateCanvasElements(
		state.currentSlide,
		newElement,
		state.presentationId,
		image,
	);
	clearCanvas(ctx, canvasRef, newElements);
};
