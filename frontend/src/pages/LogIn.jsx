import './pagesStyle.css';
import AuthImagePattern from "../components/AuthImagePattern.jsx"
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import useAuthStore from "../stores/AuthStore.jsx";
import LoadingCircle from "../components/LoadingCircle.jsx";
import toast from 'react-hot-toast';

const SignUp = () => {
  const {isLoggingIn,login} = useAuthStore();
  const [showPassword,setShowPassword] = useState(false);
  const [required,setRequired] = useState(false);
  const [formData,setFormData] = useState({email:"",password:""});

  const handleShowPassword = () => setShowPassword(!showPassword);

  const valdateForm = () => {
    if(formData.email === "") {
      toast.error("Email is required");
      return false;
    }
    if(!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email is invalid");
      return false;
    }
    if(formData.password === "") {
      toast.error("Password is required");
      return false;
    }
    if(formData.password.length < 6) {
      toast.error("Password should be greater or equal to 6 characters");
      return false;
    }
    return true; // Explicitly return true when everything is valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const success = valdateForm();
    if(success === true){
      login(formData);
    }
  }
  
  useEffect(()=>{
    if(formData.password.length < 6 && formData.password.length !== 0){
      setRequired(true);
    }else{
      setRequired(false);
    }
  },[formData.password]);


  return (
    <div className="LogIn">
      
      <div className="SU-right">
      <div className="logo">
          <img src="../../../public/logo.png" alt="" />
         </div>

         <h2>LOGIN</h2>

         <p>{"Log in to join the conversation"}</p>

         <form onSubmit={handleSubmit}>
         <div className="inputbox">
         <TextField required name='email' onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} sx={{width:"100%",marginTop:"20px"}}  id="outlined-basic in2" label="Email" variant="outlined" />
         </div>
         <div className="inputbox">
         <TextField type={showPassword ? `text` : "password"} InputProps={{
          endAdornment:(
            <InputAdornment position='end'>
              <IconButton onClick={handleShowPassword}>
                {showPassword ? <VisibilityOff/> : <Visibility/>}
              </IconButton>
            </InputAdornment>
          )
         }} required name='password' onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} sx={{width:"100%",marginTop:"20px"}}  id="outlined-basic in3" label="Password" variant="outlined" />
         </div>
         <p className={`description ${required ? "required-message" : ""}`}>password is being greater or equal 6 .</p>
         <Button type='submit' variant="contained">
         {isLoggingIn ? <LoadingCircle type={{height:"24.5px",scale:".7",background:"transparent !important"}}/> : "Log in"}
          </Button>
         <div className="have-account">
          <p>{"Don't have an account?"}</p>
          <Link to="/signup">signup</Link>
         </div>
         </form>
      </div>

      <div className="SU-left">
        <AuthImagePattern/>
      </div>

    </div>
  );
};

export default SignUp;