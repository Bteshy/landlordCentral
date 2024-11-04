import React from 'react'

import './dashboard2.css'
import { useNavigate,useLocation } from 'react-router-dom';

import { useState,useEffect} from 'react';
import Header2 from "./header2";
import Sidebar2 from "./sidebar2";
export default function Tenantpopup({closePopupForm}){

    const[tenantid,setTenantid] = useState ('');
    const[firstname,setFirstname] = useState ('');
    const[lastname,setLastname] = useState ('');
    const[contact,setContact] = useState ('');
    const[email,setEmail] = useState ('');
    const[user_id,setUserid] = useState ('');
    const[occupationdate,setOccupationdate] = useState ('');
    const[error, setError] = useState('');
    const[msg, setMsg] = useState('');
    const [units, setUnits] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialUnitId = queryParams.get('unitId');

    const [unitid, setUnitid] = useState(initialUnitId || '');
   

    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchAvailableUnits();
       
    }, [msg]);
  
    const [userInfo, setUserInfo] = useState({
        email: '',
        contact: '', 
        firstname: '',
        lastname: '',
        user_id: ''
    });

    useEffect(() => {
       
        const loggedInEmail = sessionStorage.getItem('loggedInEmail');

        // Retrieve user data from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Find the user in the local storage whose Email matches the logged-in Email
        const loggedInUser = users.find(user => user.email === loggedInEmail);

        // Set the user information if found
        if (loggedInUser) {
            const { firstname, lastname, email, contact, user_id } = loggedInUser;
            setUserInfo({ firstname, lastname, email, contact, user_id});
        } else {
            // Handle case where user is not found (optional)
            console.log('User not found in local storage');
        }
    }, []);

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
                case "contact":
                setError("");
                setContact(e.target.value);
                if(e.target.value === ""){
                    setError("contact is left blank!");
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
  
    function handleSubmit(e) {
        e.preventDefault();
    
        // Clear previous error messages
        setError('');
        setMsg('');
    
        // Check if user already has a unit assigned
        fetch("http://localhost/php/checkUserUnit.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id: userInfo.user_id })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check user unit');
            }
            return response.json();
        })
        .then(data => {
            if (data.hasUnit) {
                setError("User already has a unit assigned. Cannot proceed with getting another unit.");
            } else {
                // Proceed with creating a new tenant
                if (tenantid !== "" && occupationdate !== "") {
                    var url = "http://localhost/php/tenants.php";
                    var headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    };
                    var data = {
                        tenantid: tenantid,
                        firstname: userInfo.firstname,
                        lastname: userInfo.lastname,
                        contact: userInfo.contact,
                        email: userInfo.email,
                        unitid: unitid,
                        occupationdate: occupationdate,
                        user_id: userInfo.user_id
                    };
                    console.log("Data being sent to the server:", data);
                    fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to create tenant');
                        }
                         console.log("Response:", response);
                        return response.json();
                    })
                    .then(response => {
                        setMsg(response[0].result);
                        navigate('/tenantpayment');
                    })
                    .catch(err => {
                        setError('Failed to create tenant. Please try again later.');
                        console.error(err);
                    });
                } else {
                    setError("All fields are required");
                }
            }
        })
        .catch(error => {
            setError("An error occurred while checking user's unit. Please try again later.");
            console.error("Error checking user's unit:", error);
        });
    }
    
      const clearForm = () => {
          setTenantid('');
          setFirstname('');
          setLastname('');
          setContact('');
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
        
        const today = new Date().toISOString().split('T')[0];
    

    return(
        <div className="containers">
    <Header2/>
    <div className="main-container">
        <Sidebar2 />
          <form className="tenantspopup" >
            <div className="cardten">
            <p>
                          {
                              msg !== "" ?
                              <span className="success">{msg}</span> :
                              <span className="error">{error}</span>
                          }
                      </p>
              <div className="card-header"><b> Fill in your details</b></div>
              <div className="card-body3">
                <div className="form-group" id="msg"></div>
                <div className='column'>
                <div className="form-group2">
                  <label>Tenant ID</label>
                  <input type="text" className="form-control" placeholder=' National Id'
                    onChange={(e) => handleInputChange(e, "tenantid")}
                    value={tenantid} />
                </div>
                <div className="form-group2">
                  <label>Phone Number</label>
                  <input type = "Contact"name ="contact" id= "contact" className="form-control" 
                  onChange={(e) => handleInputChange(e, "contact")}
                  value={userInfo.contact} 
                 />
                </div>
                <div className="form-group2">
                  <label>Unit</label>
                  <input className="form-control" value={unitid} onChange={(e) => setUnitid(e.target.value)}/>
                    
                
                </div>
                </div>
                <div className='column'>
                <div className="form-group2">
                  <label>First Name</label>
                  <input type = "text" name ="name" id= "name" className="form-control" 
                    onChange={(e) => handleInputChange(e, "firstname")}
                    value={userInfo.firstname} />
                </div>
                
                <div className="form-group2">
                  <label>Email</label>
                  <input type = "Email" name ="email" id= "email"  className="form-control" 
                  onChange={(e) => handleInputChange(e, "email")}
                  value={userInfo.email} 
                 />
                </div>
                <div className="form-group2">
                  <label>Occupation Date </label>
                  <input type="date" className="form-control" 
                  onChange={(e) => handleInputChange(e, "occupationdate")}
                  value={occupationdate} min={today} />
                </div>
                </div>
                <div className='column'>
                <div className="form-group2">
                  <label>Last Name</label>
                  <input type = "text" name ="name" id= "name" className="form-control" 
                    onChange={(e) => handleInputChange(e, "lastname")}
                    value={userInfo.lastname} />
                </div>
                </div>
              </div>
              <div className="card-footer2">
                <button type="submit" className="btn btn-sm btn-primary" onClick={handleSubmit}>Proceed to payment</button>
                
              </div>
            </div>
          </form>
          
          </div>
          </div>
         ) }