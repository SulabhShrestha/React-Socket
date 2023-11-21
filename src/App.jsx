import { useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3000");

  // connection socket
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  // disconnect socket
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  const formRef = useRef(null);

  // send message
  const sendMessage = (e) => {
    e.preventDefault();
    const message = formRef.current[0].value;
    if (message !== "") {
      socket.emit("message", message);
      formRef.current[0].value = "";
    }
  };
  return (
    <>
      <form action="" ref={formRef} onSubmit={sendMessage}>
        <input type="text" name="" id="" placeholder="Enter a message" />
        <input type="submit" value="Send" />
      </form>
    </>
  );
}

export default App;
