import socketio from "socket.io-client";
import { SOCKET_URL } from "config";

export const socket = socketio.connect(SOCKET_URL, { autoConnect: false });
export const SocketContext = React.createContext();