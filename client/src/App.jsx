import backgroundImage from "./assets/kingcook-bg.png";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const [sessionId] = useState(() => {

    let existing = localStorage.getItem("sessionId");

    if (!existing) {
      existing = uuidv4();
      localStorage.setItem("sessionId", existing);
    }

    return existing;
  });

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const loadMenu = async () => {

    try {

      const response = await axios.post(
        "/api/chat",
        {
          message: "menu",
          sessionId
        }
      );

      setMessages([
        {
          sender: "bot",
          text: response.data.reply
        }
      ]);

    } catch (error) {

      setMessages([
        {
          sender: "bot",
          text: "Server connection failed"
        }
      ]);
    }
  };

  const sendMessage = async (text) => {

    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    try {

      const response = await axios.post(
        "/api/chat",
        {
          message: text,
          sessionId
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.reply
      };

      setMessages((prev) => [
        ...prev,
        botMessage
      ]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong"
        }
      ]);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await sendMessage(input);

    setInput("");
  };

  const checkout = async () => {

    try {

      const response = await axios.post(
        "/api/chat",
        {
          message: "99",
          sessionId
        }
      );

      if (!response.data.total) {

        alert("No order to checkout");

        return;
      }

      const payment = await axios.post(
        "/api/chat/pay",
        {
          email: "customer@email.com",
          amount: response.data.total
        }
      );

      window.location.href =
      payment.data.data.authorization_url;

    } catch (error) {

      console.log(error);

      alert("Checkout failed");
    }
  };

  return (

    <div
      className="
      min-h-screen
      w-full
      flex
      justify-center
      items-center
      p-2
      sm:p-4
      overflow-hidden
      bg-cover
      bg-center
      bg-no-repeat
      relative
      "
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >

      {/* DARK OVERLAY */}
      <div
        className="
        absolute
        inset-0
        bg-black/70
        backdrop-blur-sm
        "
      ></div>

      {/* CHAT CONTAINER */}
      <div
        className="
        relative
        z-10
        w-full
        max-w-2xl
        h-[95vh]
        sm:h-[92vh]
        md:h-[90vh]
        bg-black/50
        backdrop-blur-md
        rounded-2xl
        md:rounded-3xl
        shadow-2xl
        flex
        flex-col
        overflow-hidden
        border
        border-orange-500/30
        "
      >

        {/* HEADER */}
        <div
          className="
          bg-gradient-to-r
          from-orange-500
          to-red-500
          p-4
          text-xl
          md:text-2xl
          font-bold
          flex
          items-center
          justify-center
          text-white
          "
        >
          KingCook 🍲
        </div>

        {/* MESSAGES */}
        <div
          className="
          flex-1
          overflow-y-auto
          p-3
          md:p-5
          space-y-4
          "
        >

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`
              max-w-[85%]
              md:max-w-[75%]
              p-3
              rounded-2xl
              text-sm
              md:text-base
              whitespace-pre-wrap
              break-words

              ${msg.sender === "user"
                ? "bg-orange-500 ml-auto text-white"
                : "bg-white/10 backdrop-blur-md text-white"}
              `}
            >
              {msg.text}
            </div>
          ))}

          <div ref={messagesEndRef}></div>

        </div>

        {/* INPUT AREA */}
        <div
          className="
          p-3
          bg-black/30
          flex
          gap-2
          "
        >

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 flex-1"
          >

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Type option..."
              className="
              flex-1
              p-3
              rounded-xl
              bg-slate-700
              text-white
              outline-none
              text-sm
              md:text-base
              "
            />

            <button
              type="submit"
              className="
              bg-orange-500
              px-5
              rounded-xl
              text-white
              font-semibold
              "
            >
              Send
            </button>

          </form>

          <button
            type="button"
            onClick={checkout}
            className="
            bg-green-600
            px-5
            rounded-xl
            text-white
            font-semibold
            whitespace-nowrap
            "
          >
            Pay
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;