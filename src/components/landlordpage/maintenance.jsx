import React, { useState, useEffect, useRef} from 'react';
import './rest.css';
import {ReactToPrint} from 'react-to-print';
import { FaPrint } from "react-icons/fa";

// Assuming you have a Header and Sidebar component
import Header from "./header";
import Sidebar from "./sidebar";

export default function MaintenanceRequests() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [error, setError] = useState('');
  const[msg, setMsg] = useState('');
  const componentRef = useRef(); 

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = () => {
    fetch("http://localhost/php/maintenance.php")
      .then(response => response.json())
      .then(data => {
        setMaintenanceRequests(data);
      })
      .catch(error => {
        console.error("Error fetching maintenance requests:", error);
        setError("Failed to load maintenance requests.");
      });
  };
  const handleDelete = (maintenance_id) => {
    if (window.confirm("Are you sure you want to delete this maintenance request?")) {
        // Use the native fetch API
        fetch(`http://localhost/php/maintenance.php?id=${maintenance_id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
            setMsg(data.message);
            fetchMaintenanceRequests(); // Refresh the maintenance list after deletion
        })
        .catch(error => {
            console.error('Error deleting maintenance request:', error);
            setMsg("Failed to delete the maintenance request");
        });
    }
};
  return (
    <div className="containers">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="col-lg-12">
          <div className="row mb-4 mt-4">
            <div className="col-md-12">
              <div className="card3">
                <div className="card-header2">
                  <b>List of Maintenance Requests: </b>  
                 
                </div>
                <div className="card-body2">
  
 

                <div className='printrep'>
                                    <ReactToPrint
                                        trigger ={()=>{
                                            return <button type="button" className="btn btn-sm btn-default3" >
                                            <i className='print'><FaPrint /></i>  Print</button>
                                        }}
                                        content={() => componentRef.current} // Pass the ref here
                                      documentTitle={`NEEMA APPARTMENT Maintenance request `} 
                                                pageStyle="print"
                                            />
                                        </div>

                                    <div  ref={componentRef}>
                    <table className="table table-condensed table-bordered table-hover">
                      <thead>
                        <tr>
                        
                          <th>Unit ID</th>
                          <th>Description</th>
                          <th>Priority</th>
                          <th className="no-print"> If fixed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenanceRequests.map((request, index) => (
                          <tr key={index}>
                          
                            <td>{request.Unit_id}</td>
                            <td>{request.Description}</td>
                            <td>{request.Priority}</td>

                            <td className="no-print">
         
         <button className="btn btn-sm btn-danger ml-2"onClick={() => handleDelete(request.maintenance_id)} >Clear Request</button>
       
    </td>
                          </tr>
                        ))}
                      </tbody>
                      <footer>
                     <p>Total number of maintenace Request: <b>{maintenanceRequests.length}</b></p> 
                      </footer>
                  
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
