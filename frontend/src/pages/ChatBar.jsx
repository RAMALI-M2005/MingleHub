import './pagesStyle.css';
import logo from "../../public/logo.png";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { IconButton } from '@mui/material';
import  useThemeStore  from '../stores/ThemeStore.jsx';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from '../stores/AuthStore.jsx';

const ChatBar = () => {
  const { theme, setTheme } = useThemeStore();
  const { logout } = useAuthStore();

  return (
    <div className="NavBar">
    <div className="logo">
        <img src={logo} alt="logo" />
        <span className='logoname'>MingleHub</span>
    </div>

    <nav className="navigation">
        <span className="change-theme" onClick={() => setTheme(!theme)}>
            <IconButton>
            {theme ? <WbSunnyIcon/> : <BedtimeIcon/>} 
            </IconButton>
        </span>
        <span className="profile-btn">
          <IconButton>
            <PersonIcon/>
            </IconButton>
        </span>
        <span className="profile-btn" onClick={()=>logout()}>
          <IconButton>
            <LogoutIcon/>
            </IconButton>
        </span>
    </nav>
</div>
  );
};

export default ChatBar;