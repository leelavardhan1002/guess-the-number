import { io } from "socket.io-client";
const socket = io("https://guess-the-number-production.up.railway.app/", {
  autoConnect: false,
});
export default socket;
