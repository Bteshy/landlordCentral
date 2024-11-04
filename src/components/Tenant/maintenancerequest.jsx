import React, { useState, useEffect } from 'react';
import Header2 from "./header2";
import Sidebar2 from "./sidebar2";
import './maintenace.css'

export default function Maintenance() {
  const [email, setEmail] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const[unitid,setUnitid] = useState ('');
    const [tenantid, setTenantid] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userInfo, setUserInfo] = useState({
      email: '',
      user_id: ''
  });
  const [data, setData] = useState({}); 
    useEffect(() => {
       
      const loggedInEmail = sessionStorage.getItem('loggedInEmail');

      // Retrieve user data from local storage
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // Find the user in the local storage whose Email matches the logged-in Email
      const loggedInUser = users.find(user => user.email === loggedInEmail);

      // Set the user information if found
      if (loggedInUser) {
          const {firstname,lastname,contact,email, user_id } = loggedInUser;
          setUserInfo({firstname,lastname,contact,email, user_id});
      } else {
          // Handle case where user is not found (optional)
          console.log('User not found in local storage');
      }
  }, []);
  useEffect(() => {
    fetch("http://localhost/php/checkUserUnit.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            user_id: userInfo.user_id,
           
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data); // Log the fetched data
            if (data.hasUnit) {
                const tenantid = data.tenant.tenant_id; // Access tenant_id field
                setUnitid(data.unitid);
                setTenantid(tenantid); // Update the tenantid state here
                setData(data);
              
            } 
        })
        .catch(error => {
            console.error('Error:', error);
        });
}, [userInfo.user_id, tenantid]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { email, unitid, description, priority };
        console.log(formData);
        try {
            const response = await fetch('http://localhost/php/mail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.text();
            console.log(data);
            if (response.ok) {
              setSuccessMessage('Message sent successfully.');
              setEmail('');
              setUnit('');
              setDescription('');
              setPriority('');
              setTimeout(() => {
                setSuccessMessage('');
              }, 3000); // Hides the success message after 3 seconds
            } else {
              setErrorMessage('Failed to send message.');
            }
          } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while sending the message.');
          }
        };
    return(
        <div className="containers">
    <Header2/>
    <div className="main-container">
        <Sidebar2 />
    
<form onSubmit={handleSubmit}>
    <div  className='maintenace'>
    {successMessage && <p className="success">{successMessage}</p>}
                        {errorMessage && <p className="error">{errorMessage}</p>}
  <div className="form-group">
    <label htmlFor="exampleFormControlInput1">Email address</label>
    <input
  type="email"
  name ="email" 
  id= "email" 
  className="form-control"
  placeholder="name@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
</div>

<div className="form-group">
<label htmlFor="unitInput">Unit</label>
<input
  type="text"
  className="form-control"
 
  value={data.unitid}
  onChange={(e) => setUnit(e.target.value)}
/>
</div>

<div className="form-group">
<label htmlFor="descriptionTextarea">Description</label>
<textarea
  className="form-control"
  rows={3}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
</div>
<div className="form-group">
<label htmlFor="prioritySelect">Priority</label>
<select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
  <option>High</option>
  <option>Medium</option>
  <option>Low</option>
</select>
  </div>
  
  <button type="submit" className="btn btn-primary">Send</button>
  </div>
</form>
 </div>
 </div>
)
}