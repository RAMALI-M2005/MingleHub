import { Search } from '@mui/icons-material';
import './pagesStyle.css';
import useAuthStore from '../stores/AuthStore.jsx';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import {useNavigate} from "react-router-dom";

const ChatSideBar = () => {
  const { friends, isSearching,setAuthFriend, getFriends,getChatMessages ,isGettingMessages,messages} = useAuthStore();
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();
  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filteredFriends = friends?.filter(friend =>
    friend.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMessages = (friend)=>{
    const id = friend._id;
    setAuthFriend(friend);
    navigate(`/${id}`);
  }

  return (
    <div className="ChatSideBar">
      <div className="ChatHeader">CONTACTS</div>
      <div className="ChatSearch">
        <Search />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      <div className="ChatFriends" style={isSearching ? {justifyContent: "center",alignItems: "center"} : {}}>
        {isSearching ? (
          <CircularProgress />
        ) : (
          <>
            {filteredFriends?.map((friend, ind) => (
              <div className="friend" key={ind} onClick={()=>handleMessages(friend)}>
                <div className="friendCircle">
                  <img src="../../../public/logo.png" alt="user photo" />
                </div>
                <div className="friendBody">
                  <div className="friend-fullname">{friend.fullname}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
