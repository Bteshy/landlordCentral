import React from 'react'
import Header from "./header";
import Sidebar from "./sidebar";

import { useNavigate } from 'react-router-dom';

import './reports.css'
export default function Reports(){
    const naviget =useNavigate();
return(
<div className = "containers">
  <Header/>
 <div className = " main-container">
 <Sidebar />
<div className='cardcontainer'>
<div className='cardwrapper'>
<div className= 'report'>
  <div className='cardheader'>
    <div className= 'number'><span class ='title'> Monthly Pyament report</span></div>
    </div>
    <div class="view2"onClick={() => naviget('/Monthlyreport')}>
      <div class ='view2txt' >View Details</div>
    </div>
  </div>

  <div className= 'report'>
  <div className='cardheader'>
    <div className= 'number'><span class ='title'> Rental balance report</span></div>
   
    </div>
    <div class="view2" onClick ={()=> naviget('/balancereport')}>
      <div class ='view2txt'>View Details</div>
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  )}