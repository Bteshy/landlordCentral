import React from 'react'

import { useState, useEffect } from 'react';
import Viewinvoice from '../landlordpage/viewinvoice';
import Header2 from "./header2";
import Sidebar2 from "./sidebar2";

import { FaPlus } from "react-icons/fa6";
import { FaEye } from 'react-icons/fa6';


export default function PaymentDetails() {
    const [paymentData, setPaymentData] = useState([]);
    const [error, setError] = useState();
    const [paymentId, setpaymentId] = useState();
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [showPopupForm, setShowPopupForm] = useState(false);
    const [showViewForm, setShowViewForm] = useState(false); 
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [tenant, setTenant] = useState();
    const [userInfo, setUserInfo] = useState({
        email: '',
        user_id: ''
    });
  
    

    const togglePopupForm = () => {

        setShowPopupForm(!showPopupForm);
    };

    const toggleViewForm = (payment) => {
     setSelectedPayment(payment);
        setShowViewForm(!showViewForm);
    };
    useEffect(() => {
       
        const loggedInEmail = sessionStorage.getItem('loggedInEmail');

        // Retrieve user data from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Find the user in the local storage whose Email matches the logged-in Email
        const loggedInUser = users.find(user => user.email === loggedInEmail);

        // Set the user information if found
        if (loggedInUser) {
            const { user_id } = loggedInUser;
            setUserInfo({user_id});
        } else {
            // Handle case where user is not found (optional)
            console.log('User not found in local storage');
        }
    }, []);
    useEffect(() => {
        if (userInfo.user_id) {
             console.log(`Fetching with user_id: ${userInfo.user_id}`); 
            fetchindivPaymentDetails();
        }
    }, [userInfo.user_id]); // Add this useEffect
   
    const fetchindivPaymentDetails = () => {
        fetch(`http://localhost/php/individual.php?user_id=${userInfo.user_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tenant details');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data from backend:", data); // Log the data received from the backend
                setPaymentData(data);
            })
            .catch(error => {
                setError(error.message);
            });
    };
    
   



    const paymentDatas = paymentData && paymentData.length > 0 ? paymentData.filter(paymentData =>
        (typeof paymentData.Amount_paid === 'string' && paymentData.Amount_paid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof paymentData.Date_paid === 'string' && paymentData.Date_paid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof paymentData.payment_id === 'string' && paymentData.payment_id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, entriesToShow) : [];
    

    return (
    
            <div className="containers">
            <Header2/>
            <div className="main-container">
                <Sidebar2 />
                <div className="col-lg-12">
                    <div className="row mb-4 mt-4">
                        <div className="col-md-12">

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card3">

                                <div className="card-header2">
                                    <b>List of your Payments</b>
                                    

                                </div>
                                <div className="card-body">
                                <div className="popup">
 
 
</div>

{showViewForm && (
    <div className="popup">
        <Viewinvoice first_name={selectedPayment && selectedPayment.first_name} closeViewForm={toggleViewForm}  last_name={selectedPayment && selectedPayment.last_name}
    payment_id={selectedPayment && selectedPayment.payment_id}
    email={selectedPayment && selectedPayment.email}
    phone_number={selectedPayment && selectedPayment.phone_number}
    Date_paid={selectedPayment && selectedPayment.Date_paid}
    rent_of={selectedPayment && selectedPayment.rent_of}
    Amount_paid={selectedPayment && selectedPayment.Amount_paid}
    Outstanding_balance={selectedPayment && selectedPayment.Outstanding_balance}
    Unit_id = {selectedPayment && selectedPayment.Unit_id}
    closePopupForm={toggleViewForm}/>
     
    </div>
)}

                                    <div className='filter'>
                                        <select className='values ' value={entriesToShow} onChange={(e) => setEntriesToShow(e.target.value)}>
                                            <option value="5">Show 5</option>
                                            <option value="10">Show 10</option>
                                            <option value="20">Show 20</option>
                                        </select>
                                        <div className='inputb'>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)} />
                                        </div>

                                    </div>


                                    <div>
                                    
                                    {paymentDatas.length > 0 ? (// Check if tenantData is not undefined and has data
                                            <table className="table table-condensed table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th> Date</th>
                                                       
                                                        <th>Rent of </th>
                                                        
                                                        <th>Receipt NO</th>
                                                        <th>Amount Paid</th>
                                                        <th> Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paymentDatas.map((paymentData, index) => (
                                                        <tr key={index}>
                                                            <td>{paymentData.Date_paid}</td>
                                                           
                                                            <td>{paymentData.rent_of}</td>
                                                            <td>{paymentData.payment_id}</td>
                                                            <td>{paymentData.Amount_paid}</td>
                                                            <td>
                                                <button className="btn btn-sm btn-primary" onClick={() => toggleViewForm(paymentData)}>
                                                    <FaEye /> View
                                                </button>
                                          
                                              
                                        </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div></div>
                                        )}
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
