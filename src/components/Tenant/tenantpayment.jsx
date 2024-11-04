import React, { useState, useEffect } from 'react';
import Header2 from "./header2";
import Sidebar2 from "./sidebar2";
import { useNavigate,useLocation } from 'react-router-dom';
import Viewinvoice from '../landlordpage/viewinvoice';
import './dashboard2.css'

export default function TenantPaymentPopup({closePopupForm }){
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    
    const [amount, setAmount] = useState(20); // The amount in your currency smallest unit e.g. cents for USD
    const [currency, setCurrency] = useState('KES');
    const [publicKey, setPublicKey] = useState('pk_live_5dca6fc23dd71236a41ff8567063bd44524644a0');
    // Add your Paystack Public Ke
     const [error, setError] = useState('');
     const [msg, setMsg] = useState('');
     const [rentOf, setRentOf] = useState('');
     const [tenant, setTenant] = useState([]);
     const [paymentData, setPaymentData] = useState([]);
     const [showInvoice, setShowInvoice] = useState(false);
     const [paymentDetails, setPaymentDetails] = useState({});

    const[unitid,setUnitid] = useState ('');
    const [tenantid, setTenantid] = useState('');
    const [outstandingbalance, setOutstandingbalance] = useState('');
    const naviget =useNavigate();
    const [userInfo, setUserInfo] = useState({
        email: '',
        user_id: ''
    });
    const [data, setData] = useState({}); 
    
   
   
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      }, []);
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
        setTimeout(function () {
            setMsg("");
        }, 15000);
        fetchPaymentDetails();
    }, [msg]);

    
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
                    setUnitid(unitid);
                    setTenantid(tenantid); // Update the tenantid state here
                    setData(data);
                    fetchPaymentDetails();
                } 
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [userInfo.user_id, tenantid]);

    
    
    const handlePaystackSuccess = (response) => {
    console.log(response);
    alert(`Payment Successful! Reference: ${response.reference}`);
    
    const currentDate = new Date().toISOString().split('T')[0];

    
    // Retrieve tenant_id from local storage
    

    // Prepare the payment data
    const paymentData = {
        Date_paid: currentDate,
        Amount_paid: amount,
        tenant_id: tenantid,
        rent_of: rentOf,
       
    };
    setPaymentDetails(paymentData);
     // Show the invoice

    // Make a POST request to store the payment data
    fetch("http://localhost/php/Payment.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the backend
        // Handle any further logic here based on the response
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error scenarios here
    });
};
const fetchPaymentDetails = () => {
    fetch(`http://localhost/php/managepayment.php?tenantid=${tenant.tenantid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tenant details');
            }
            return response.json();
        })
        .then(data => {  
        
           
                // If the expected properties are defined in the data object
                setPaymentData(data);
                setOutstandingbalance(data.Outstanding_balance);
              
            
        })
        .catch(error => {
            setError(error.message);
        });
};



    
      const handlePaystackClose = () => {
        console.log('Payment closed');
        // handle close logic here
      };
    
      const payWithPaystack = (e) => {
        e.preventDefault();
    
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: userInfo.email,
          amount: amount * 100, // Assuming the amount is in the base currency unit, convert to kobo
          currency: currency,
          ref: `${Math.floor(Math.random() * 1000000000) + 1}`, // your reference, you should probably use something more secure
          onClose: handlePaystackClose,
          callback: handlePaystackSuccess,
        });
    
        handler.openIframe();
      };

    return (
        <div className="containers">
            <Header2 />
            <div className="main-container">
                <Sidebar2 />
                <form className="paymentPopup">
                    <div className="cardpay">
                        <p>
                            {msg !== "" ? <span className="success">{msg}</span> : <span className="error">{error}</span>}
                        </p>
                        {showInvoice ? (
                              <div className="popup">
                            <Viewinvoice
                                first_name={userInfo.firstname} // Assume you have these details
                                last_name={userInfo.lastname}
                                payment_id={paymentDetails.payment_id} // Example, adjust based on your data structure
                                email={userInfo.email}
                                phone_number={userInfo.contact} // Assume you have these details
                                Date_paid={paymentDetails.Date_paid}
                                rent_of={paymentDetails.rent_of}
                                Amount_paid={paymentDetails.Amount_paid}
                                Outstanding_balance={paymentDetails.Outstanding_balance} // Calculate or fetch this
                                Unit_id={data.unitid} // Fetch or determine this
                                closePopupForm={() => setShowInvoice(false)} // Function to close the invoice view
                            />
                            </div>
                        ) : (
                            <>
                        <div className="card-header3"><b>Payment Form</b></div>
                       
                                <div className="form-group3">
                                    <label>Unit</label>
                                    <input className="form-control" value={data.unitid} onChange={(e) => setUnitid(e.target.value)} />
                                </div>
                                <div className="form-group3">
                                    <label>Month for Rent</label>
                                    <select className="form-control" value={rentOf} onChange={(e) => setRentOf(e.target.value)}>
                                        <option value="">Select Month</option>
                                        {months.map((month, index) => (
                                            <option key={index} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group3">
                                    <label>Amount </label>
                                    <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="card-footer3">
                        <button type="submit" className="btn btn-sm btn-primary" onClick={payWithPaystack}>Pay</button>
                        <button type="button" className="btn btn-sm btn-default" onClick={closePopupForm}>Cancel</button>
                        <button type="button" className="btn btn-sm btn-temporary" onClick={() => naviget('/individualpay')}>view payments</button>
              
              
                        
                    </div>
                </form>
            </div>
        </div>
    );
                                        }