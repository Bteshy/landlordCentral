import React from 'react'
import './rest.css'
import { useState,useEffect} from 'react';
// import Header from "./header";
// import Sidebar from "./sidebar";
export default function Tenantpopup({closePopupForm}){

    const[tenantid,setTenantid] = useState ('');
    const[firstname,setFirstname] = useState ('');
    const[lastname,setLastname] = useState ('');
    const[phonenumber,setPhonenumber] = useState ('');
    const[email,setEmail] = useState ('');
    const[unitid,setUnitid] = useState ('');
    const[occupationdate,setOccupationdate] = useState ('');
    const[error, setError] = useState('');
    const[msg, setMsg] = useState('');
    const [units, setUnits] = useState([]);
   

    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchAvailableUnits();
       
    }, [msg]);

    

    const handleInputChange =(e, type)=> {

        switch(type){
            case "tenantid":
                setError("");
                setTenantid(e.target.value);
                if(e.target.value === ""){
                    setError("tenantid is left blank!");
                }
                break;
            case "firstname":
                setError("");
                setFirstname(e.target.value);
                if(e.target.value === ""){
                    setError("firstname is left blank!");
                }
                break;
                case "lastname":
                setError("");
                setLastname(e.target.value);
                if(e.target.value === ""){
                    setError("lastname is left blank!");
                }
                break;
                case "email":
                setError("");
                setEmail(e.target.value);
                if(e.target.value === ""){
                    setError("email is left blank!");
                }
                break;
                case "phonenumber":
                setError("");
                setPhonenumber(e.target.value);
                if(e.target.value === ""){
                    setError("Phonenumber is left blank!");
                }
                break;
                case "Unitid":
                setError("");
                setUnitid(e.target.value);
                if(e.target.value === ""){
                    setError("Unitid is left blank!");
                }
                break;
                case "occupationdate":
                setError("");
                setOccupationdate(e.target.value);
                if(e.target.value === ""){
                    setError("occupationdate is left blank!");
                }
                break;
            default:
        }
    }
  
          function handleSubmit(e){
          e.preventDefault()
              if(tenantid!== "" && firstname !== "" && lastname !== ""  && phonenumber !== "" && email!== "" && unitid !== "" && occupationdate!== ""){
                  
              var url = "http://localhost/php/tenants.php";
              var headers = {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
              };
              var Data = {
                  tenantid:tenantid,
                  firstname:firstname,
                  lastname: lastname,
                  phonenumber:phonenumber,
                  email: email,
                  unitid:unitid,
                  occupationdate:occupationdate

                  
              }
              fetch(url, {
                  method: "POST",
                  headers: headers,
                  body: JSON.stringify(Data)
              }).then((response) => response.json())
              .then((response) => {
                  setMsg(response[0].result);
               }).catch((err) =>{
                  setError(err);
                  console.log(err);
              });
              clearForm();
              
      
          }
          else{
              setError("All fields are required")
          }
      }
      const clearForm = () => {
          setTenantid('');
          setFirstname('');
          setLastname('');
          setPhonenumber('');
          setEmail('');
          setUnitid('');
          setOccupationdate('');
        };
        const fetchAvailableUnits = () => {
            fetch("http://localhost/php/availableunits.php") 
                .then(response => response.json())
                
                .then(data => {
                    console.log('unit',data)
                    setUnits(data);
                })
                .catch(error => {
                    console.error("Error fetching units:", error);
                    setError("Failed to load available units.");
                });
        };
    

    return(
          <form className="tenantspopup" >
            <div className="card4">
            <p>
                          {
                              msg !== "" ?
                              <span className="success">{msg}</span> :
                              <span className="error">{error}</span>
                          }
                      </p>
              <div className="card-header"><b>Tenant Form</b></div>
              <div className="card-body3">
                <div className="form-group" id="msg"></div>
                <div className='column'>
                <div className="form-group2">
                  <label>Tenant ID</label>
                  <input type="text" className="form-control"
                    onChange={(e) => handleInputChange(e, "tenantid")}
                    value={tenantid} />
                </div>
                <div className="form-group2">
                  <label>Phone Number</label>
                  <input type="text" className="form-control" 
                  onChange={(e) => handleInputChange(e, "phonenumber")}
                  value={phonenumber} />
                </div>
                <div className="form-group2">
                  <label>Unit</label>
                  <select className="form-control" value={unitid} onChange={(e) => setUnitid(e.target.value)}>
                    <option value="">Select a Unit</option>
                    {units.map((unit, index) => (
                        <option key={index} value={unit.Unit_id}>{unit.Unit_id} - {unit.Unit_type}</option>
                    ))}
                </select>
                </div>
                </div>
                <div className='column'>
                <div className="form-group2">
                  <label>First Name</label>
                  <input type="text" className="form-control" 
                    onChange={(e) => handleInputChange(e, "firstname")}
                    value={firstname} />
                </div>
                
                <div className="form-group2">
                  <label>Email</label>
                  <input type="email" className="form-control" 
                  onChange={(e) => handleInputChange(e, "email")}
                  value={email} />
                </div>
                <div className="form-group2">
                  <label>Occupation Date </label>
                  <input type="date" className="form-control" 
                  onChange={(e) => handleInputChange(e, "occupationdate")}
                  value={occupationdate} />
                </div>
                </div>
                <div className='column'>
                <div className="form-group2">
                  <label>Last Name</label>
                  <input type="text" className="form-control" 
                    onChange={(e) => handleInputChange(e, "lastname")}
                    value={lastname} />
                </div>
                </div>
              </div>
              <div className="card-footer2">
                <button type="submit" className="btn btn-sm btn-primary" onClick={handleSubmit}>Save</button>
                <button type="button" className="btn btn-sm btn-default" onClick={closePopupForm}>Cancel</button>
              </div>
            </div>
          </form>
          
          
         ) }