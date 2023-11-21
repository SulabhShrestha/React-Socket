import { useRef, useState } from "react";
import { io } from "socket.io-client";
import MessageModel from "./model/message_model";

function App() {
  const socket = io("http://localhost:3000");

  const [messages, setMessages] = useState([]);

  // connection socket
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  // receive message
  socket.on("message", (message) => {
    console.log("Message received: ", message);
    setMessages([...messages, message]);
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
      socket.emit("message", new MessageModel(socket.id, new Date(), message));
      formRef.current[0].value = "";
      setMessages([
        ...messages,
        new MessageModel(socket.id, new Date(), message),
      ]);
    }
  };
  return (
    <>
      <div className="messages">
        {messages.map((message, index) => (
          <p key={index}>
            Sent by: {message.sender} at {message.date.toLocaleString()}{" "}
            {message.msg}
          </p>
        ))}
      </div>
      <form action="" ref={formRef} onSubmit={sendMessage}>
        <input type="text" name="" id="" placeholder="Enter a message" />
        <input type="submit" value="Send" />
      </form>
    </>
  );
}

export default App;
