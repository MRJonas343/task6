"use client";

import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Button, Divider } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useReducer, useRef } from "react";
import { socket } from "@/constants";
import { useDndSensors } from "@/hooks";
import { exportToPdf, updateSlidesPositions } from "@/Services";
import * as sockets from "@/sockets";
import { Dropdown, SlidePreview, TextArea, Toolbar, UserProfile } from ".";
import { SlideDropDown } from "./SlideDropDown";
import { initialState, reducer } from "./state";
import * as tools from "./tools";

export const Presentation = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const textAreRef = useRef<HTMLTextAreaElement>(null);
	const stateRef = useRef<typeof initialState>(state);
	const ctx = canvasRef.current?.getContext("2d");
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const { id, name } = useParams();
	const sensors = useDndSensors();

	useEffect(() => {
		if (typeof window !== "undefined" && canvasRef.current) {
			canvasRef.current.width = window.innerWidth * 0.7;
			canvasRef.current.height = window.innerHeight * 0.9;
			ctxRef.current = canvasRef.current.getContext("2d");
			tools.setInitialData(
				stateRef.current,
				dispatch,
				String(name),
				String(id),
				ctxRef.current,
				canvasRef,
			);
		}
		sockets.joinPresentation(String(id), String(name));
		sockets.participantsListeners(dispatch, String(name));
		sockets.updateSlidesListener(dispatch);
		sockets.updateElementsListeners(dispatch, stateRef, ctxRef.current);
		sockets.updateFullCanvasListener(
			stateRef,
			dispatch,
			ctxRef.current,
			canvasRef,
		);

		return () => {
			socket.off("newSlides");
			socket.off("participants");
			socket.off("newElements");
			socket.off("updateFullCanvas");
		};
	}, []);

	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	return (
		<main className="min-h-screen flex flex-col h-auto">
			<Toolbar
				state={state}
				chageStrokeColor={(color) => tools.chageStrokeColor(color, dispatch)}
				changeEditorMode={(mode) =>
					tools.changeEditorMode(ctx, state, mode, dispatch)
				}
				onUndo={() => tools.onUndo(state, dispatch, ctx, canvasRef)}
				onReundo={() => tools.onReundo(state, dispatch, ctx, canvasRef)}
				exportToPDF={() => exportToPdf(ctx, canvasRef, state)}
			/>
			<section className="flex w-full h-screen flex-grow">
				<div className="w-[15%] border-r-2 border-gray-700 min-h-full h-auto overflow-y-auto scrollbar pb-32">
					<p className="text-center text-lg pt-2">Slides</p>
					<div className="flex pb-2 justify-center pt-4">
						<Button
							className="w-[66%]"
							color="primary"
							variant="shadow"
							radius="sm"
							onClick={() => sockets.createSlide(state.presentationId)}
							isDisabled={state.role === "viewer" || state.role === "editor"}
						>
							Add Slide
						</Button>
					</div>
					<DndContext
						autoScroll={false}
						sensors={sensors}
						onDragEnd={(e) => updateSlidesPositions(e, dispatch, state)}
					>
						<SortableContext
							disabled={state.role === "viewer"}
							items={state.slidesPreviews}
						>
							{state.slidesPreviews.map((item) => (
								<SlidePreview
									isLoading={state.isLoading}
									key={item.id}
									slideId={item.id}
									slidePreview={item.slidePreview}
									openSlideMenu={(e, id) =>
										tools.openSlideMenu(e, id, dispatch)
									}
									changeCurrentSlides={(id) =>
										tools.changeCurrentSlide(state, dispatch, id)
									}
								/>
							))}
						</SortableContext>
					</DndContext>
				</div>

				<canvas
					ref={canvasRef}
					className="w-[70%] border-b-3 max-h-[90vh]"
					onMouseDown={(e) =>
						tools.onMouseDown(e, state, dispatch, canvasRef, ctx)
					}
					onMouseUp={(e) =>
						tools.onMouseUp(e, state, dispatch, canvasRef, textAreRef, ctx)
					}
					onMouseMove={(e) =>
						tools.onMouseMove(e, state, canvasRef, ctx, dispatch)
					}
					onContextMenu={(e) =>
						tools.onRightClick(e, dispatch, canvasRef, state, ctx)
					}
				/>

				<div className="w-[15%] border-l-2 border-gray-700 p-4 min-h-full h-auto scrollbar overflow-y-auto pb-32">
					{state.participanName === state.presentationCreator ? (
						<p className="text-blue-600">You</p>
					) : (
						<p>{state.presentationCreator}</p>
					)}
					<span className="text-sm text-gray-600">Creator</span>
					<Divider className="my-4 bg-gray-700 h-[2px] w-full mx-auto" />
					{state.participants.map((user) => (
						<UserProfile
							id={user.id}
							key={user.id}
							userName={user.userName}
							role={user.role}
							changeRole={() =>
								sockets.changeUserRole(
									state.presentationId,
									user.userName,
									user.role,
								)
							}
							state={state}
						/>
					))}
				</div>
			</section>
			<Dropdown
				state={state}
				bringToFront={() => tools.bringToFront(state, ctx, canvasRef, dispatch)}
				sendToBack={() => tools.sendToBack(state, ctx, canvasRef, dispatch)}
				changeStroke={() =>
					tools.changeStrokeColorOfElement(state, ctx, canvasRef, dispatch)
				}
				fillElement={() => tools.fillElement(state, ctx, canvasRef, dispatch)}
				deleteElement={() =>
					tools.deleteElement(state, ctx, canvasRef, dispatch)
				}
			/>
			<TextArea
				state={state}
				dispatch={dispatch}
				textAreRef={textAreRef}
				handleTextChange={() =>
					tools.handleTextChange(state, dispatch, ctx, canvasRef)
				}
			/>
			<SlideDropDown
				state={state}
				dispatch={dispatch}
				deleteElement={() =>
					sockets.deleteSlide(
						state.presentationId,
						state.clikedSlideId,
						dispatch,
					)
				}
			/>
		</main>
	);
};
