import { useContext } from "react";
import { SocketContext } from "@/context/SocketProvider";

const useSocket = () => {
	const context = useContext(SocketContext);

	if (!context)
		throw new Error("useSocket must be called within SocketProvider");

	return context;
};

export default useSocket;
