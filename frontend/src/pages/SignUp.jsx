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
  const {isSigningUp,signup} = useAuthStore();
  const [showPassword,setShowPassword] = useState(false);
  const [required,setRequired] = useState(false);
  const [formData,setFormData] = useState({fullname:"",email:"",password:""});

  const handleShowPassword = () => setShowPassword(!showPassword);

  const valdateForm = () => {
    if(formData.fullname === "") {
      toast.error("Full name is required");
      return false; // Return false to stop further execution
    }
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
      signup(formData);
    }
  };

  useEffect(()=>{
    if(formData.password.length < 6 && formData.password.length !== 0){
      setRequired(true);
    }else{
      setRequired(false);
    }
  },[formData.password]);


  return (
    <div className="SignUp">
      
      <div className="SU-right">
      <div className="logo">
          <img src="../../../public/logo.png" alt="" />
         </div>

         <h2>Create Account</h2>

         <p>Get started with your free account</p>

         <form onSubmit={handleSubmit}>
         <div className="inputbox">
         <TextField  name='fullname' onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} sx={{width:"100%",marginTop:"10px"}} id="outlined-basic in1" label="Full Name" variant="outlined" />
         </div>
         <div className="inputbox">
         <TextField  name='email' onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} sx={{width:"100%",marginTop:"20px"}}  id="outlined-basic in2" label="Email" variant="outlined" />
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
         }}  name='password' onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} sx={{width:"100%",marginTop:"20px"}}  id="outlined-basic in3" label="Password" variant="outlined" />
         </div>
         <p className={`description ${required ? "required-message" : ""}`}>password should be greater or equal 6 .</p>
         <Button type='submit' variant="contained">
         {isSigningUp ? <LoadingCircle type={{height:"24.5px",scale:".7"}}/> : "create account"}
          </Button>
         <div className="have-account">
          <p>{"Already have an account?"}</p>
          <Link to="/login">login</Link>
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