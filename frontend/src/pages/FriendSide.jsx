// frontend/FriendSide.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import useThemeStore from "../stores/ThemeStore.jsx";
import useAuthStore from "../stores/AuthStore.jsx";
import CircleLoading from "../components/LoadingCircle.jsx";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react";
import "./pagesStyle.css";

// Connect to Socket.io server
const socket = io("http://localhost:5000");

const FriendSide = () => {
  const { isGettingMessages, authUser, setMessages, getChatMessages, authFriend, messages, sendMessage } = useAuthStore();
  
  const [open, setOpen] = useState(false);
  const [Friend, setFriend] = useState(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Join the room when the component is mounted
  useEffect(() => {
    if (authFriend) {
      setFriend(authFriend);
      getChatMessages(authFriend);

      socket.emit("join", authUser._id, authFriend._id);
      // Join the room for this friend
    }
  }, [authFriend, getChatMessages, authUser]);

  // Scroll to the last message when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.senderId !== authUser._id) {
        setMessages(newMessage);
      }
    };
  
    socket.on("receiveMessage", handleReceiveMessage);
  
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };

    //! in the next time if you get any problem you need to know 
    //! the variable authUser._id  in the array of dependecies is the problem
    //! remove it     
  }, [setMessages,messages]);
  

  // Handle sending a message
  const handleSendingMessage = () => {
    if (Friend && message.trim()) {
      const newMessage = {
        senderId: authUser._id,
        receiverId: Friend._id,
        text: message,
        createdAt: new Date().toISOString(),
      };
  
      // Send the message to the server
      sendMessage(Friend, message);
      socket.emit("sendMessage", newMessage);
  
      // Update the local state immediately to display the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      setMessage(""); // Clear the input after sending
    }
  };

  // Handle emoji picker
  const handleEmojiClicked = useCallback((emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setOpen(false);
  }, []);

  // Close the emoji picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="FriendSide">
      <div className="FS-header">
        <div className="friendInfo">
          <div className="friend-logo">
            <img src="../../public/logo.png" alt="Friend" />
          </div>
          <div className="friendname">{Friend?.fullname}</div>
        </div>
      </div>

      <div className="FS-body">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={msg.senderId === Friend?._id ? "user-message" : "friend-message"}>
              <div className="content-message">{msg.text}</div>
              <div className="timestamp">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) || "00:00"}
              </div>
            </div>
          ))
        ) : (
          <div className="noMessages"><p>No messages</p></div>
        )}
        <div ref={scrollRef}></div>
      </div>

      <div className="FS-footer">
        <div className="icons">
          <AddPhotoAlternateIcon />
        </div>
        <div className="icons" onClick={() => setOpen((prev) => !prev)}>
          <EmojiEmotionsIcon />
        </div>

        <div className="emoji-picker" ref={emojiPickerRef}>
          <EmojiPicker open={open} theme={"auto"} onEmojiClick={handleEmojiClicked} />
        </div>

        <div className="message-input">
          <input onChange={(e) => setMessage(e.target.value)} value={message} type="text" placeholder="ENTER YOUR MESSAGE" />
        </div>

        <div className="icons" onClick={handleSendingMessage}>
          <SendIcon />
        </div>
      </div>
    </div>
  );
};

export default FriendSide;
