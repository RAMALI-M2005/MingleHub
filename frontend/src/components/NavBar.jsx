import './component.css';
import logo from "../../public/logo.png";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { IconButton } from '@mui/material';
import  useThemeStore  from '../stores/ThemeStore.jsx';

const NavBar = () => {
  const { theme, setTheme } = useThemeStore();
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
            </nav>
    </div>
  );
};

export default NavBar;