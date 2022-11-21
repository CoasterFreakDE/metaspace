export let pingTimeout: NodeJS.Timeout;

export function setupServerConnection() {
  const socket = new WebSocket("wss://metaws.coasterfreak.de");

  socket.onopen = () => {
    console.log("connected");
    heartbeat(socket);
  };

  socket.onclose = () => {
    console.log("disconnected");
    clearTimeout(pingTimeout);
  };

  socket.onerror = (error) => {
    console.log(error);
  };

  return {socket, heartbeat};
}

function heartbeat(socket: WebSocket) {
  clearTimeout(pingTimeout);
  socket.send(JSON.stringify({ event: "world" }));

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  pingTimeout = setTimeout(() => {
    // @ts-ignore
    this.terminate();
  }, 30000 + 1000);
}
