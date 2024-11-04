import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect} from 'react';
import './sidebar2.css';


import { FaUserCircle } from "react-icons/fa";
import building_icon from '../Assets/building-solid.svg';
import tenants_icon from '../Assets/users-solid.svg';
import payment_icon from '../Assets/credit-card-solid.svg';
import logout_icon from '../Assets/right-from-bracket-solid.svg';
import logo_icon from '../Assets/Group 46.svg'




export default function Sidebar2(){

  const naviget =useNavigate();
  function logoutSubmit(){
    localStorage.setItem("login", "");
    localStorage.setItem("loginStatus", "Logged out succefully")
    naviget("/");
  }
  const [activeLink, setActiveLink] = useState('');
return(
<div className='sidebar2'>
     
        <div className ='scrolls2'>
          <div className = 'logostyle'>
        <div className ="logo"> <img src ={logo_icon} alt=""/>
         </div></div>
          <ul>
          <li className= {activeLink === '/dashboard2' ? 'active' : ''}> <a href='#' onClick={() => naviget('/dashboard2')}> <img src ={building_icon} alt=""/> <span>Available Units</span></a></li>
            <li className= {activeLink === '/maintenacerequest' ? 'active' : ''}> <a href = '#' onClick={() => naviget('/maintenancerequest')} ><img src ={tenants_icon} alt=""/> <span>Maintenace Requests</span></a></li>
            <li className= {activeLink === '/tenantpayment' ? 'active' : ''}> <a href='#' onClick={() => naviget('/tenantpayment')} ><img src ={payment_icon} alt=""/> <span>Payment</span></a></li>
            <li className = 'logout'  onClick={logoutSubmit}> <a href = '#'><img src ={logout_icon} alt=""/><span>Log out</span></a></li>
            </ul>
        </div>  
        </div>
        )
    }
