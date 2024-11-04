import React from 'react'
import './login.css'
import { useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';


import key_icon from '../Assets/key-solid.svg'
import user_icon from '../Assets/user-solid.svg'
export default function Login(){

    const naviget =useNavigate();
 
    const[role,setRole] = useState('')
    const[password,setPassword] = useState ('')
    const[error,setError] = useState ('')
    const[msg, setMsg] = useState("")
    const[email,setEmail] = useState ('');
    

    useEffect(() => {
        let loginStatus = localStorage.getItem("loginStatus");
        if (loginStatus) {
            setError(loginStatus);
            setTimeout(function(){
                localStorage.removeItem("loginStatus"); // Remove specific item
                window.location.reload();
            }, 3000);
        }
        setTimeout(function(){
            setMsg("");
        }, 5000);
    }, [msg]);
    
    
     const handleinputhange = (e,type) =>{
        switch(type){
            case "email":
                setError("");
                setEmail(e.target.value);
                if(e.target.value === ""){
                    setError("email is blank")
                }
                break;
                case "password":
                setError("");
                setPassword(e.target.value);
                if(e.target.value === ""){
                    setError("password is blank")
                }
                break;
                default:
        }

    }

   function loginSubmit(e){
      e.preventDefault();
      
        if (email !== "" && password !== "") {
            var url = 'http://localhost/php/login.php';
            var headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            var data ={
           
                email: email, 
                password: password
        };
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }).then((response)=> response.json())
        .then((response)=>{console.log(response);
        if (response[0].result ==="Invalid email"|| response[0].result === "Invalid password"){
            setError(response[0].result);
        }
        else{setMsg(response[0].result);
            
        
            const role = response[0].role;
            setTimeout(() => {
            if (role === "admin") {
                naviget('/dashboard'); // Redirect admin to landlord page
            } else {
                naviget('/dashboard2'); // Redirect regular users to tenant page
            }
        }, 3000); 
        sessionStorage.setItem('loggedInEmail', email);
        sessionStorage.setItem('loggedInPassword', password);
     
        

        }})
        .catch((error) => {setError(error);
        console.log(error);})
    }
            else{
                setError("All fields are required")
            }
        }
        
       
        
            
  return (
   
    <form className = 'containerlog' >
        <p>
            {
                error !==""?
                <span className = 'error'> {error}</span>:
                <span className = 'success'> {msg}</span>
                
          }
        </p>
        <div className = "Headerlog">
            <div className = "text">Login </div>
            <div className = "Signin_to_continue"> Sign in to continue</div>
        </div>   
      
         <div className = 'inputs'>
            <div className ='input'>
                <img src ={user_icon} alt="" />
                <input type = "Email" name ="email" id= "email"   placeholder='Email'
                onChange={(e)=> handleinputhange(e,"email")}
                value={email}/>
            </div>
            
            <div className ='input'>
                <img src ={key_icon} alt="" />
                <input type = "password"name ="password" id= "password" placeholder='*******'
                 onChange={(e)=> handleinputhange(e,"password")}
                 value={password}/>
            </div>
         </div>
         <div className= "submit_container">
         {/* <div className ="forgot_password">Forgot your password?<span>Click here to reset</span> </div> */}
         <button className= "login" onClick= {loginSubmit}>Login </button>
          <div className= "register">Do not have an account? <br></br><span onClick={() => naviget('/signup')}>Register New Account</span></div>
         </div>
       
    </form> 
    
  );
}

