import { socket } from "@/constants";

export const deleteSlide = (slideId: string) => {

	socket.emit("deleteSlide", slideId);
};
