import { create } from "zustand";
import {toast} from 'react-hot-toast';
import axios from "axios";

const useAuthStore = create((set) => ({
    isSigningUp: false,
    authUser: null,
    isLoggingIn: false,
    isCheckingAuth:false,
    isLoggingOut:false,
    login: async(data) => {
        set({ isLoggingIn: true })
         try {
            const response = await axios.post("http://localhost:5000/api/auth/login", data);
            set({ authUser: response.data });
            localStorage.setItem("jwt",response.data.token);
            toast.success("Account created successfully");
         } catch (error) {
            console.error("error signup:", error);
            toast.error(error.response.data.message);
         }finally{
            set({ isLoggingIn: false })
         }
    },
    signup: async(data) => {
        set({ isSigningUp: true });
        try {
            const response = await axios.post("http://localhost:5000/api/auth/signup", data);
            set({ authUser: response.data });
            localStorage.setItem("jwt",response.data.token);
            toast.success("Account created successfully");
        } catch (error) {
            console.error("error signup:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async() => {
        set({ authUser: null });
        set({isLoggingOut:true});
        try {
            
            const res = await axios.post("http://localhost:5000/api/auth/logout");

            localStorage.removeItem('jwt');
            toast.success(res.data.message);
            
        } catch (error) {
            console.error("error signup:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingOut: false });
        }
    },
    checkIsAuth: async()=>{
        set({isCheckingAuth:true});
        try{
            const token = localStorage.getItem("jwt");
            const response = await axios.get("http://localhost:5000/api/auth/check",{
                headers:{
                    jwt: token
                }
            });
            set({authUser: response.data});
            console.log("check user auth is success")
        }catch (error) {
            console.error("error checkAuth:",error);
            set({authUser: null});
            toast.error("Session expired, please log in again.");
        }finally{
            set({isCheckingAuth: false});
        }
    } ,
    friends:null,
    isSearching:false,
    getFriends: async()=>{
        set({isSearching: true});
        const token = localStorage.getItem("jwt");
      try {
        const response = await axios.get("http://localhost:5000/api/message/users",{
            headers:{
                jwt: token
            }
        });

        set({friends:response.data});
        
      } catch (error) {
        console.error("error checkAuth:",error);
        toast.error("can not get the users");
    }finally{
        set({isSearching: false});
    }

    },
    messages:null,
    setMessages: (newMessage) =>
        set((state) => {
          // تأكد أن الرسالة الجديدة غير فارغة أو غير معرفة
          if (!newMessage || typeof newMessage !== "object") return state;
      
          return {
            messages:  [...state.messages, newMessage]
          };
        }),
           
    isGettingMessages:false,
    authFriend:null,
    setAuthFriend : (friend)=> set({authFriend:friend}),
    getChatMessages: async(friend)=>{
        set({isGettingMessages: true});
        const token = localStorage.getItem("jwt");
        try {
            const id = friend._id;
            const response = await axios.get(`http://localhost:5000/api/message/${id}`,{
                headers:{
                    jwt: token
                }
            });
            set({messages:response.data});
        } catch (error) {
            console.error("error checkAuth:",error);
        toast.error("can not get room messages");
        }finally{
            set({isGettingMessages: false});
        }
    },
    sendMessage: async (friend, message) => {
        const token = localStorage.getItem("jwt");
        try {
            const id = friend._id;
            const response = await axios.post(`http://localhost:5000/api/message/send/${id}`, {
                text: message
            }, {
                headers: {
                    jwt: token
                }
            });
    
            if (!response.data) {
                toast.error("Cannot send that message");
                return;
            }
    
            // تحديث الحالة وإضافة الرسالة الجديدة إلى القائمة
            set((state) => ({
                messages: state.messages ? [...state.messages, response.data] : [response.data]
            }));
    
        } catch (error) {
            console.error("error sending the message:", error.response);
            toast.error("error: sending message denied");
        }
    }
}));

export default useAuthStore;