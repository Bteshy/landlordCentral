import React, { useState, useEffect } from 'react';
import './rest.css';

const EditTenant = ({ tenants, handleUpdate, handleClose }) => {
  const[tenantid,setTenantid] =useState(tenants.tenant_id);
  const [firstname, setFirstname] = useState(tenants.first_name);
  const [lastname, setLastname] = useState(tenants.last_name);
  const [contact, setContact] = useState(tenants.phone_number);
  const [email, setEmail] = useState(tenants.email);
  const[unitid,setUnitid] = useState(tenants.Unit_id);
  const [occupationdate, setOccupationdate] = useState(tenants.occupation_date);
  const [units, setUnits] = useState([]);
  const[error, setError] = useState('');
  const[msg, setMsg] = useState('');
   
  useEffect(() => {
    setTimeout(function(){
        setMsg("");
    }, 15000);
    fetchAvailableUnits();
   
}, [msg]);
  const fetchAvailableUnits = () => {
    fetch("http://localhost/php/availableunits.php") 
        .then(response => response.json())
        
        .then(data => {
         
            setUnits(data);
        })
        .catch(error => {
            console.error("Error fetching units:", error);
            setError("Failed to load available units.");
        });
};

  useEffect(() => {
    setTenantid(tenants.tenant_id);
    setFirstname(tenants.first_name);
    setLastname(tenants.last_name);
    setContact(tenants.phone_number);
    setEmail(tenants.email);
    setUnitid(tenants.Unit_id);
    setOccupationdate(tenants.occupation_date);
  }, [tenants]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTenant = {
      tenantid: tenantid,
      firstname: firstname,
      lastname: lastname,
      contact: contact,
      email: email,
      unitid: unitid,
      occupationdate: occupationdate
    };
    handleUpdate(updatedTenant);
  };


 
 
  return (
    <div className="edit-form3">
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>Tenant id</label>
          <input
            type="text"
            className="form-control"
            value={tenantid}
            onChange={(e) => setTenantid(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone number</label>
          <input
            type="text"
            className="form-control"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group2">
            <label>Unit</label>
            <select
              className="form-control"
              value={unitid}
              onChange={(e) => setUnitid(e.target.value)}
            >
              <option value="">Select a Unit</option>
              {units.map((unit, index) => (
                <option key={index} value={unit.Unit_id}>
                  {unit.Unit_id} - {unit.Unit_type}
                </option>
              ))}
            </select>
          </div>
        <div className="form-group">
          <label>Occupation Date</label>
          <input
            type="date"
            className="form-control"
            value={occupationdate}
            onChange={(e) => setOccupationdate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-sm btn-default" onClick={handleClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTenant;
