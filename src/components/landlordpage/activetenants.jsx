import React from 'react'
import './rest.css'
import { useState,useEffect, useRef} from 'react';

import Header from "./header";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa6";
import {ReactToPrint} from 'react-to-print';
import { FaPrint } from "react-icons/fa";

export default function TenantDetails() {
  const [tenant, setTenant] = useState();
  const [error, setError] = useState();

  
  const[msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesToShow, setEntriesToShow] = useState(10);
  const componentRef = useRef();
  

  
    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchTenant();
    }, [msg]);

    const fetchTenant = () => {
        fetch("http://localhost/php/tenants.php")
            .then(response => response.json())
            .then(data => {
                setTenant(data);
            })
            .catch(error => {
                console.error("Error fetching tenants:", error);
                setError("Failed to load tenants.");
            });
    };
          
      
    const filteredTenants = tenant ? tenant.filter(tenants =>
        tenants.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenants.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenants.Unit_id.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, entriesToShow) : [];
    


    return(
        <div className = "containers">
  <Header/>
 <div className = " main-container">
 <Sidebar />
    
          <div class="col-lg-12">
		<div class="row mb-4 mt-4">
			<div class="col-md-12">
				
			</div>
		</div>
		<div class="row">
						<div class="col-md-12">
				<div class="card3">
                    
					<div class="card-header2">
						<b>List of Active Tenants</b>
                      
             
					</div>
                    <div class="card-body2">
                   
                    <div className='filter'>
                    <select className ='values 'value={entriesToShow} onChange={(e) => setEntriesToShow(e.target.value)}>
                            <option value="5">Show 5</option>
                            <option value="10">Show 10</option>
                            <option value="20">Show 20</option>
                        </select>
                        <div className='inputb'>
    <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  />
        </div>
    
                    </div>
					
                    <div className='printrep'>
                                    <ReactToPrint
                                        trigger ={()=>{
                                            return <button type="button" className="btn btn-sm btn-default3" >
                                            <i className='print'><FaPrint /></i>  Print</button>
                                        }}
                                        content={() => componentRef.current} // Pass the ref here
                                      documentTitle={`NEEMA APPARTMENT Tenants `} 
                                                pageStyle="print"
                                            />
                                        </div>

                                    <div  ref={componentRef}>
              <table class="table table-condensed table-bordered table-hover">
                  <thead>
                      <tr>
                          <th> Tenant id</th>
                          <th>First name</th>
                          <th>Last name</th>
                          <th>Phone number</th>
                          <th>Email</th>
                          <th> Unit</th>
                          <th> Occupation date</th>

                          
                      </tr>
                  </thead>
                  <tbody>
                      {filteredTenants.map((tenants) => (
                         <tr key={tenants.tenant_id}>
                             <td>{tenants.tenant_id}</td>
                              <td>{tenants.first_name}</td>
                              <td>{tenants.last_name}</td>
                              <td>{tenants.phone_number}</td>
                              <td>{tenants.email}</td>
                              <td>{tenants.Unit_id}</td>
                              <td>{tenants.occupation_date}</td>
                              
                    
                          </tr>
                      ))}
                  </tbody>
                  <tfoot>
                                                <tr>
                                                   
                                                    <td colSpan="1" style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Tenants:</td>
                                                        <td style={{ fontWeight: 'bold', fontSize: '20px' }}> {filteredTenants.length}</td>
                                                </tr>
                                            </tfoot>
              </table>
          
     </div>
               
                </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
   
  );
}

        
 
