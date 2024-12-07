import React, { useState, useEffect } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import api from '../../api'

/* const LeftSidebar = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); */

  const LeftSidebar = ({ setActiveChatId }) => {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState(""); // Inicializa la variable search


  useEffect(() => {
    // const fetchChatsAndUsers = async () => {
      const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/Chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setChats(response.data);

          /* // Obtener detalles de los usuarios únicos de los chats
          const userIds = [
            ...new Set(chatsData.flatMap((chat) => chat.members)),
          ];
          const usersResponse = await fetch(
            "http://localhost:3001/api/Users/details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ userIds }),
            }
          );

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const usersMap = usersData.reduce((acc, user) => {
              acc[user._id] = user;
              return acc;
            }, {});
            setUsers(usersMap);
          } */
        } else {
          console.error("Error al cargar los chats");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) => {
    if (chat.isGroup) {
      return chat.groupName
        .toLowerCase()
        .includes(search.toLowerCase());
    } else {
      return chat.members.some((memberId) =>
        users[memberId]?.username
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit profile</p>
              <hr />
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="Search" />
          <input
            type="text"
            placeholder="Search here.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="ls-list">
        {filteredChats.map((chat) => (
          <div
            key={chat._id}
            className="friends"
            onClick={() => navigate(`/chat/${chat._id}`)}
          >
            <img
              src={
                chat.isGroup
                  ? chat.groupAvatar
                  : assets.profile_img // Cambiar por avatar real si está disponible
              }
              alt="Avatar"
            />
            <div>
              <p>
                {chat.isGroup
                  ? chat.groupName
                  : users[chat.members[0]]?.username || "Unknown"}
              </p>
              <span>Último mensaje...</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
