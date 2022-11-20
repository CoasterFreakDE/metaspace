
export function setupServerConnection() {
  const socket = new WebSocket("wss://metaws.coasterfreak.de");

  socket.onopen = () => {
    console.log("connected");
  };

  socket.onclose = () => {
    console.log("disconnected");
  };

  socket.onerror = (error) => {
    console.log(error);
  };

  return socket;
}