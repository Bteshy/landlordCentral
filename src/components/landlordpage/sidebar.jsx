import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css'
import { useState,useEffect} from 'react';


import { FaUserCircle } from "react-icons/fa";
import building_icon from '../Assets/building-solid.svg';
import file_icon from '../Assets/file-solid.svg';
import dashboard_icon from '../Assets/gauge-solid.svg';
import unit_icon from '../Assets/house-solid.svg';
import tenants_icon from '../Assets/users-solid.svg';
import payment_icon from '../Assets/credit-card-solid.svg';
import logout_icon from '../Assets/right-from-bracket-solid.svg';
import bell_icon from '../Assets/bell-regular.svg';



export default function Sidebar(){
  const [userInfo, setUserInfo] = useState({
    username: ''
});
const [activeLink, setActiveLink] = useState('');
const location = useLocation();

useEffect(() => {
    
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = users.find(user => user.email === loggedInEmail);

    
    if (loggedInUser) {
        const { firstname, lastname } = loggedInUser;
        setUserInfo({firstname, lastname });
    } else {
        console.log('User not found in local storage');
    }

    setActiveLink(location.pathname);
}, [location.pathname]);


  const naviget =useNavigate();
  function logoutSubmit(){
    localStorage.setItem("login", "");
    localStorage.setItem("loginStatus", "Logged out succefully")
    naviget("/");
  }
  const handleNavigate = (path) => {
    setActiveLink(path); 
    naviget(path); 
  };
 
return(
<div className='sidebar'>
     <i className ='usericon'><FaUserCircle /></i>
       <div className="Username" >USERNAME <br></br><span>{userInfo.firstname}   {userInfo.lastname}</span></div>
        

        <div className ='scrolls'>
          <ul>
            <li className= {activeLink === '/dashboard' ? 'active' : ''}> <a href='#' onClick={() => naviget('/dashboard')}> <img src ={dashboard_icon} alt=""/> <span>Dashboard</span></a></li>
           
            <li className={activeLink === '/building' ? 'active' : ''}> <a href='#' onClick={() => naviget('/building')}><img src ={building_icon} alt=""/> <span>Building</span></a></li>
            <li className={activeLink === '/unit' ? 'active' : ''}> <a href = '#' onClick={() => naviget('/unit')}><img src ={unit_icon} alt=""/> <span>Units</span></a></li>
            <li className= {activeLink === '/tenants' ? 'active' : ''}> <a href = '#' onClick={() => naviget('/tenants')}><img src ={tenants_icon} alt=""/> <span>Tenants</span></a></li>
            <li className={activeLink === '/payment' ? 'active' : ''}> <a href = '#'onClick={() => naviget('/payment')}><img src ={payment_icon} alt=""/> <span>Payment</span></a></li>
            <li className={activeLink === '/reports' ? 'active' : ''}> <a href = '#'onClick={() => naviget('/maintenance')}><img src ={bell_icon} alt=""/><span>Notifications</span></a></li>
            <li className={activeLink === '/reports' ? 'active' : ''}> <a href = '#'onClick={() => naviget('/reports')}><img src ={file_icon} alt=""/><span>Reports</span></a></li>
            
            <li class = 'logout'  onClick={logoutSubmit}> <a href = '#'><img src ={logout_icon} alt=""/><span>Log out</span></a></li>
            </ul>
        </div>  
        </div>
        )
    }
