import React from 'react'
import './rest.css'
import { useState,useEffect} from 'react';
import Tenantpopup from './tenantpopup';
import Header from "./header";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa6";
import Edittenants from './edittenants'; 

export default function TenantDetails() {
  const [tenantData, setTenantData] = useState();
  const [error, setError] = useState();
  const [tenantId, setTenantId] = useState();
  const[msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [tenant, setTenant] = useState();
  const [showEditForm, setShowEditForm] = useState(false); // State to control visibility of edit form
  const [selectedTenant, setSelectedTenant] = useState(null);
  

    const togglePopupForm = () => {
        setShowPopupForm(!showPopupForm);
    };
   
    
    useEffect(() => {
        fetchTenants();
    }, []); 

    const fetchTenants = () => {
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
      
          
      
    const handleDelete = (tenant_id) => {
        if (window.confirm("Are you sure you want to delete this tenant?")) {
            // Use the native fetch API
            fetch(`http://localhost/php/managetenants.php?id=${tenant_id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                setMsg(data.message);
                fetchTenants(); // Refresh the tenants list after deletion
             
            })
            .catch(error => {
                console.error('Error deleting tenant:', error);
                setMsg("Failed to delete the tenant");
            });
        }
    };
    const handleEdit = (unit) => {
        setSelectedTenant(unit); // Set the unit data to be edited
      setShowEditForm(true); // Show the popup
    };

    const handleCloseEdit = () => {
        setSelectedTenant(null); // Clear the unit data
      setShowEditForm(false); // Hide the popup
    };
    const handleUpdate = (updatedTenant) => {
        fetch("http://localhost/php/managetenants.php", {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedTenant)
        })
        .then(response => response.json())
        .then(data => {
          console.log(updatedTenant);
          setMsg(data.message);
          setShowEditForm(false); // Close the edit tenant popup
          fetchTenants(); // Refresh the tenants list after update
        })
        .catch(error => {
          console.error("Error updating tenant:", error);
          setMsg("Failed to update the tenant");
        });
      };
      
      
      const filteredTenants = tenant
    ? tenant.filter(tenant => 
        (tenant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.Unit_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !tenant.is_archived
    ).slice(0, entriesToShow)
    : [];
  
      


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
						<b>List of Tenants</b>
                        <div class="newtenant" onClick={togglePopupForm}>
					<i class="fa fa-plus"><FaPlus /></i> New Tenant</div>
             
					</div>
                    <div class="card-body2">
                    {showPopupForm && <Tenantpopup closePopupForm={togglePopupForm} />}
                    <div className="popup">
                    {showEditForm && <Edittenants tenants={selectedTenant} handleUpdate={handleUpdate} handleClose={handleCloseEdit} />}
                   
          </div>
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
					
						
           <div>
       
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
                          <th> Action</th>

                          
                      </tr>
                  </thead>
                  <tbody>
                      { filteredTenants.map((tenants) => (
                           <tr key={tenants.tenant_id}>
                           <td>{tenants.tenant_id}</td>
                            <td>{tenants.first_name}</td>
                            <td>{tenants.last_name}</td>
                            <td>{tenants.phone_number}</td>
                            <td>{tenants.email}</td>
                            <td>{tenants.Unit_id}</td>
                            <td>{tenants.occupation_date}</td>
                            
                  
                       
            <td>
            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(tenants)}>Edit</button>
             <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(tenants.tenant_id)}>Delete</button>
           
        </td>
                          </tr>
                      ))}
                  </tbody>
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

        
 
