import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import MessageModel from "./model/message_model";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const formRef = useRef(null);
  const messagesRef = useRef(null);
  const leftChatProcessed = useRef(false); // Flag to track if "someone-left-the-chat" event is processed

  useEffect(() => {
    // Scroll to the bottom of the messages div when messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // receive message
  socket.on("message", (message) => {
    console.log("Message received: ", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  console.log("asdf");

  // when someone left the chat
  socket.on("someone-left-the-chat", (user) => {
    if (!leftChatProcessed.current) {
      const chatLeftMessage = document.createElement("p");
      chatLeftMessage.textContent = user + " left the chat";

      chatLeftMessage.classList.add("text-center", "text-sm", "mx-2");

      if (messagesRef.current) {
        messagesRef.current.appendChild(chatLeftMessage);
      }

      // Set the flag to true after processing the event
      leftChatProcessed.current = true;
    }
  });

  // send message
  const sendMessage = (e) => {
    e.preventDefault();
    const message = formRef.current[0].value;
    if (message.trim() !== "") {
      socket.emit("message", new MessageModel(socket.id, new Date(), message));
      formRef.current[0].value = "";
      setMessages((prevMessages) => [
        ...prevMessages,
        new MessageModel(socket.id, new Date(), message),
      ]);
    }
  };

  return (
    <main className="h-screen flex flex-col">
      <div className="messages flex-grow overflow-y-auto" ref={messagesRef}>
        {messages.map((message, index) => (
          <p
            key={index}
            className={`mx-10 max-w-max text-2xl my-2 ${
              message.sender === socket.id
                ? "bg-green-400 ml-auto"
                : "bg-blue-400 mr-auto"
            }`}
          >
            Sent at: {message.date.toLocaleString()}, Message: {message.msg}
          </p>
        ))}
      </div>
      <form
        action=""
        ref={formRef}
        onSubmit={sendMessage}
        className="justify-self-end bg-gray-400 px-8 py-2 mb-2 flex"
      >
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter a message"
          className="flex-grow p-2 mr-4 rounded-lg"
        />
        <input
          type="submit"
          value="Send"
          className="bg-blue-500 px-4 rounded-lg"
        />
      </form>
    </main>
  );
}

export default App;
