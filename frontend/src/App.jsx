import './index.css';
import NavBar from './components/NavBar';
import  useThemeStore  from './stores/ThemeStore.jsx';
import { Routes , Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp.jsx';
import Home from './pages/Home.jsx';
import LogIn from './pages/LogIn.jsx';
import {Toaster} from 'react-hot-toast';
import useAuthStore from './stores/AuthStore.jsx';
import ChatBar from './pages/ChatBar.jsx';
import CircleLoading from "./components/LoadingCircle.jsx";
import { useEffect } from 'react';

const App = () => {
  const { theme } = useThemeStore();
  const { authUser ,isCheckingAuth ,isLogginOut,checkIsAuth } = useAuthStore();

  useEffect(()=>{
    checkIsAuth();
  },[checkIsAuth]);

  if((!authUser && isCheckingAuth) || isLogginOut) return <div className='loader'><CircleLoading type={theme ? 'dark' : ""}/></div>;

  return (
    <div className={`App ${theme ? 'dark' : null}`}>

       {authUser ? <ChatBar/> : <NavBar/> }

       <Routes>
          <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to="/"/>} />
          <Route path="/*" element={authUser ? <Home/> : <Navigate to="/signup"/>} />
          <Route path="/login" element={!authUser ? <LogIn/> : <Navigate to="/"/> } />
       </Routes>
     
       <Toaster toastOptions={{className: 'react-hot-toast'}}/>

    </div>
  );
};

export default App;