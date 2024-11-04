import React from 'react'
import { useState,useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
import { LuRectangleHorizontal } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";

import './dashboard.css';
import Header from "./header";
import Sidebar from "./sidebar";



export default function Dashboard(){
  const[error, setError] = useState('');
  const [tenant, setTenant] = useState([]);
  const [units, setUnits] = useState([]);
const [unitCount, setUnitCount] = useState(0);
const [tenantCount, setTenantCount] = useState(0);
const [vacantCount, setVacantCount] = useState(0);
const [paymentCount, setPaymentCount] = useState(0);

  const naviget =useNavigate();

  useEffect(() => {
   
    fetchTenants(); 
    fetchUnits(); 
    fetchTenantCount();
    fetchVacantCount();
    fetchPaymentCount();
   
}, []);

  const fetchTenants = () => {
    fetch("http://localhost/php/tenants.php")
        .then(response => response.json())
        .then(data => { 
        const sortedTenants = data.sort((a, b) => new Date(b.occupation_date) - new Date(a.occupation_date));
      // Take the first 5 entries from the sorted array
      const newestTenants = sortedTenants.slice(0, 5);

      setTenant(newestTenants);
          
        })
        .catch(err => {
         
            console.error("Error fetching buildings:", err);
            setError("Failed to load buildings.");
        });
  };
  const fetchUnits = () => {
    fetch("http://localhost/php/units.php")
      .then((response) => response.json())
      .then((data) => {
        setUnits(data); // Assuming the API returns an array of units
        setUnitCount(data.length); // Set the count based on the data length
      })
      .catch((err) => {
        console.error("Error fetching units:", err);
        // Optionally update error state or UI here
      });
  };
  const fetchTenantCount = () => {
    fetch("http://localhost/php/tenants.php?count=true")
      .then((response) => response.json())
      .then((data) => {
        
        if (data && data.tenantCount) {
          setTenantCount(data.tenantCount);
          
        }
      })
      .catch((err) => {
        console.error("Error fetching tenant count:", err);
        // Optionally update error state or UI here
      });
  };
  const fetchPaymentCount = () => {
    fetch("http://localhost/php/monthpaymentcount.php")
      .then((response) => response.json())
      .then((data) => {
        
        if (data && data.paymentCount) {
          setPaymentCount(data.paymentCount);
          
        }
      })
      .catch((err) => {
        console.error("Error fetching payment count:", err);
        // Optionally update error state or UI here
      });
  };
  
  const fetchVacantCount = () => {
    fetch("http://localhost/php/units.php?vacantCount=true")
      .then((response) => response.json())
      
      .then((data) => {
        console.log("Vacant count:", data);
        if (data && data.vacantCount) {
          setVacantCount(data.vacantCount);
          console.log("Response from server:", data.vacantCount);
        }
      })
      .catch((err) => {
        console.error("Error fetching vacant unit count:", err);
        console.error("Response status:", err.status);
        console.error("Response text:", err.statusText);
        setError("Failed to load vacant unit count.");
      });
  };
 
  return(
<div className = "containers">
  <Header/>
 <div className = " main-container">
 <Sidebar />
<div className='cardcontainer'>
<div className='cardwrapper'>
<div className= 'availableunits blue'>
  <div className='cardheader'>
    <div className ='title'>Avalable Units</div>
    <div className='number1' style={{ fontSize: '60px', color: 'white' }}>{unitCount}</div>
    <i className='unit2'  ><FaHome/></i>
    </div>
    <div class="view"onClick={() => naviget('/unit')}>
      <div class ='viewtxt' >View Details</div>
    </div>
  </div>

  <div className= 'availableunits orange'>
  <div className='cardheader'>
    <div className ='title'>  Vacant units</div>
    <div className='number1' style={{ fontSize: '60px', color: 'white' }}>{vacantCount} </div>
    <i className='unit2'><LuRectangleHorizontal /></i>
    </div>
    <div class="view" onClick ={()=> naviget('/vacantunits')}>
      <div class ='viewtxt'>View Details</div>
    </div>
  </div>

  <div className= 'availableunits green'>
  <div className='cardheader'>
  <div className ='title'>  Payments this month</div>
  <div className='number1' style={{ fontSize: '60px', color: 'white' }}>{paymentCount}</div>
 
    <i className='unit2'><MdOutlinePayment/></i>
    </div>
    <div class="view" onClick={() => naviget('/monthlypayment')}>
      <div class ='viewtxt'>View Details</div>
    </div>
  </div>
 

  <div className= 'availableunits red'>
  <div className='cardheader'>
    <div className ='title'> Active Tenants</div>
    <div className='number1' style={{ fontSize: '60px', color: 'white' }}>{tenantCount}</div>
    <i className='unit2'><FaUsers/></i>
    </div>
    <div class="view" onClick={() => naviget('/activetenants')}>
      <div class ='viewtxt'>View Details</div>
    </div>
  </div>

</div>
<div className ="tablecontainer">
<i className='users2'><FaUsers/></i>
<div classname= 'title'> 5 Newest Tenants</div>
</div>
<div className='tablewrapper'>
<div className= 'Table'> 
<table>
<thead>
<tr>
<th>Name</th>
<th>Phone number</th>
<th>Unit</th>
<th>Occupation date</th>
</tr>
</thead>

<tbody>
{tenant.map((tenants) => (
  <tr key={tenants.tenant_id}>
    <td>{`${tenants.first_name} ${tenants.last_name}`}</td>
    <td>{tenants.phone_number}</td>
    <td>{tenants.Unit_id}</td>
    <td>{tenants.occupation_date}</td>
  </tr>
))}
</tbody>
</table>

</div> 
</div>
</div> 
</div>
</div>

  )
}