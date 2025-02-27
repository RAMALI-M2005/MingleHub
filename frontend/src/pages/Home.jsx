import "./pagesStyle.css";
import ChatSideBar from "../pages/ChatSideBar.jsx";
import FriendSide from "../pages/FriendSide.jsx";
import Welcome from "../pages/Welcome.jsx";
import { Route, Routes } from "react-router-dom";

const Home = () => {
  return (
    <div className="Home">
      <div className="HomeBody">
        <ChatSideBar />

        <Routes>
          <Route index element={<Welcome />}/>
          <Route path="/:id" element={<FriendSide />}/>
        </Routes>
      </div>
    </div>
  );
};

export default Home;
