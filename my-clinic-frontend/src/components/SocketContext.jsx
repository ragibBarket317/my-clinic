import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { useStore } from "../Store";
import notification from "/notification.mp3";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketContexts = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [searchConvo, setSearchConvo] = useState("");
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageAlert, setMessageAlert] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMsgSenderId, setNewMsgSenderId] = useState("");
  const { auth } = useStore();

  const getConversations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/message/conversations`,
        {
          withCredentials: true,
        }
      );
      if (response.data.data.conversations) {
        setConversations([...response.data.data.conversations]);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/message/${
          selectedConversation?._id
        }`,
        {
          withCredentials: true,
        }
      );
      setMessages(response.data.data.messages);
    } catch (error) {
      console.log("error", error);
    }
  };
  const seenMessage = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/message/${
          selectedConversation?._id
        }`,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };
  const sendMessage = async (message) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/message/send/${
          selectedConversation?._id
        }`,
        { message },
        {
          withCredentials: true,
        }
      );
      if (response.data.data.newMessage) {
        setMessages((prev) => [...prev, response.data.data.newMessage]);
        // getMessages();
        getConversations();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const deleteMessage = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/message/delete/${id}`,

        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        await getMessages();
        await getConversations();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const updateMessage = async (id, message) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/message/update/${id}`,
        { message },
        {
          withCredentials: true,
        }
      );
      if (response.data.data.message) {
        await getMessages();
        await getConversations();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_BASE_SOCKET_URL, {
      query: { userId: auth?.data?.data?.data?._id },
    });
    setSocket(newSocket);
    getConversations();
    return () => newSocket.close();
  }, [auth]);

  const handleOnlineUsers = function (data) {
    setOnlineUsers(data);
  };
  const handleReloadConvo = useCallback(
    function (userId) {
      if (userId.toString() === auth?.data?.data?.data?._id.toString()) {
        getConversations();
        getMessages();
      }
    },
    [selectedConversation]
  );
  const handleNewMessage = useCallback(
    (newMessage) => {
      // if (!selectedConversation?._id) return;

      if (newMessage?.senderId?.toString() === selectedConversation?._id) {
        // getMessages();
        setNewMsgSenderId("");
        setMessages((prev) => [...prev, newMessage]);
        seenMessage();
        getConversations();
      } else {
        try {
          if (
            auth?.data?.data?.data?.notifyOn == "none" ||
            auth?.data?.data?.data?.notifyOn == "note"
          ) {
            return;
          } else {
            const audio = new Audio(
              `/notificationSounds/message${
                auth?.data?.data?.data?.preferredMessagesNotificationSound ||
                "/Default.mp3"
              }`
            );
            audio.play();
          }
        } catch (err) {
          console.log(err);
        }
        setNewMsgSenderId(newMessage?.senderId?.toString());

        setMessageAlert(true);
        getConversations();
      }
    },
    [selectedConversation, auth]
  );

  useEffect(() => {
    const socketRef = socket;
    const unsubscribeGetOnlineUsers = () => {
      socketRef?.off("getOnlineUsers", handleOnlineUsers);
    };
    const unsubscribeNewMessage = () => {
      socketRef?.off("newMessage", handleNewMessage);
    };

    const unsubscribeReloadConvo = () => {
      socketRef?.off("reloadConvo", handleNewMessage);
    };

    socketRef?.on("getOnlineUsers", handleOnlineUsers);
    socketRef?.on("newMessage", handleNewMessage);
    socketRef?.on("reloadConvo", handleReloadConvo);

    return () => {
      unsubscribeGetOnlineUsers();
      unsubscribeNewMessage();
      unsubscribeReloadConvo();
    };
  }, [socket, handleOnlineUsers, handleNewMessage, handleReloadConvo]);

  useEffect(() => {
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation?._id) {
      getConversations();
    }
  }, [selectedConversation]);

  useEffect(() => {
    socket?.emit("whoSelectedWhom", selectedConversation?._id);
  }, [selectedConversation, socket]);

  useEffect(() => {
    if (searchConvo) {
      const filteredConvos = conversations.filter((convo) =>
        convo?.fullName?.toLowerCase().startsWith(searchConvo.toLowerCase())
      );
      setFilteredConversations(filteredConvos);
    } else {
      setFilteredConversations([]);
    }
  }, [searchConvo]);
  useEffect(() => {
    if (selectedConversation?._id) {
      // seenMessage();
      // getConversations();
    }
  }, [messages]);
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < conversations.length; i++) {
      if (
        conversations[i]?.lastMessageSenderId?.toString() !==
          auth?.data?.data?.data?._id &&
        Object.keys(conversations[i]).includes("seen") &&
        !conversations[i]?.seen
      ) {
        count++;
      }
    }
    setUnreadCount(count);
  }, [conversations, auth, newMsgSenderId]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        conversations,
        onlineUsers,
        selectedConversation,
        setSelectedConversation,
        messages,
        sendMessage,
        messageAlert,
        setMessageAlert,
        deleteMessage,
        updateMessage,
        searchConvo,
        setSearchConvo,
        filteredConversations,
        unreadCount,
        getConversations,
        getMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContexts;
