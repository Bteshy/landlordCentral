import React from 'react'
import './rest.css'
import { useState,useEffect} from 'react';
// import Header from "./header";
// import Sidebar from "./sidebar";
export default function Tenantpopup({closePopupForm}){

    const[tenantid,setTenantid] = useState ('');
    const[firstname,setFirstname] = useState ('');
    const[lastname,setLastname] = useState ('');
    const[contact,setContact] = useState ('');
    const[email,setEmail] = useState ('');
    const[unitid,setUnitid] = useState ('');
    const[occupationdate,setOccupationdate] = useState ('');
    const[error, setError] = useState('');
    const[msg, setMsg] = useState('');
    const [units, setUnits] = useState([]);
    const[user_id,setUserid] = useState ('');
   

    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchAvailableUnits();
       
    }, [msg]);

    

    const handleInputChange =(e, type)=> {
        const value = e.target.value.trim();

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
    const generatePassword = () => {
        const length = 8; // You can adjust the length of the generated password
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
    
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return;
        }
    
        // Validate phone number format
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(contact)) {
            setError('Invalid phone number format');
            return;
        }
        // Check if all required fields are filled
        if (firstname !== "" && lastname !== "" && contact !== "" && email !== "") {
            // Generate a password for the tenant
            const password = generatePassword();
            
            // Prepare data for user signup
            const userData = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                contact: contact,
                password: password // Assuming 'tenant' is the role for tenants
            };
            
            // API call to store user details in the users table
            fetch("http://localhost/php/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(response => {
                
                // Log the entire response object to see its structure
                console.log("Signup API Response:", response);
                
                // Check if the response contains the user_id
                if (response.user_id) {
                    // Extract user_id from the response and set it to the state variable
                    setUserid(response.user_id);
                    userData.user_id = response.user_id;
                    console.log("fidjd",response.user_id)
                    signUp(userData); 
                    // Proceed with other actions
                    setMsg(response.result);
                    submitTenantData(response.user_id); // Pass user_id to the function
                } else {
                    // Handle the case where user_id is not found in the response
                    setError("User ID not found in response");
                }
            })
          
            .catch(error => {
                console.error("Error:", error);
                setError("Error occurred during signup process");
            });
        } else {
            setError("All fields are required");
        }
    };
    
    
    const signUp = (userData) => {
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = [...existingUsers, userData];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };
    
    const submitTenantData = (user_id) => {
        if (tenantid !== "" && unitid !== "" && occupationdate !== "") {
            const data = {
                tenantid,
                firstname,
                lastname,
                contact,
                email,
                unitid,
                occupationdate,
                user_id: user_id // Use the passed user_id parameter
            };
            console.log("Data sent to server:", data); 
            fetch("http://localhost/php/tenants.php", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(response => {
                setMsg(response[0].result);
                clearForm();
            })
            .catch(err => {
                setError(err);
                console.error(err);
            });
        } else {
            setError("All fields are required");
        }
    };
    

const clearForm = () => {
    setTenantid('');
    setFirstname('');
    setLastname('');
    setContact('');
    setEmail('');
    setUnitid('');
    setOccupationdate('');
};
        
          
              
const sendPasswordEmail = () => {
    fetch("http://localhost/php/sendPasswordEmail.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, user_id }) // Pass user_id to identify the user
    })
    .then(response => response.json())
    .then(response => {
        // Handle response from the server (if needed)
        console.log(response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
};
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
        function checkEmail(){
            var url = "http://localhost/php/checkemail.php";
            var headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            var Data = {
                email: email
            }
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(Data)
            }).then((response) => response.json())
            .then((response) => {
                setError(response[0].result);
            }).catch((err) =>{
                setError(err);
                console.log(err);
            });
        }
        // function checkContact() {
        //     // Remove any spaces or hyphens that might be commonly used in formatting phone numbers
        //     const cleanedContact = contact.replace(/\D/g, '');
        
        //     if (!/^\d+$/.test(cleanedContact)) {
        //         setError("phone number must contain only numbers!");
        //     } else if (cleanedContact.length !== 10) {
        //         setError("Invalid phone number");
        //     } 
        // }
    

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
                  <input type = "Contact"name ="contact" id= "contact" className="form-control" 
                  onChange={(e) => handleInputChange(e, "contact")}
                  value={contact} 
                   />
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
                  <input type = "text" name ="name" id= "name" className="form-control" 
                    onChange={(e) => handleInputChange(e, "firstname")}
                    value={firstname} />
                </div>
                
                <div className="form-group2">
                  <label>Email</label>
                  <input type = "Email" name ="email" id= "email"  className="form-control" 
                  onChange={(e) => handleInputChange(e, "email")}
                  value={email} 
                  onBlur={checkEmail} />
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
                  <input type = "text" name ="name" id= "name" className="form-control" 
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