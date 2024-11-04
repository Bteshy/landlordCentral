import React from 'react'
import './rest.css'
import { useState, useEffect } from 'react';
import Paymentpopup from './paymentpopup';
import Header from "./header";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa6";
import { FaEye } from 'react-icons/fa6';
import Viewinvoice from './viewinvoice'; 
import Editpayment from './editpayment';
import { CiEdit } from "react-icons/ci";

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
    const [showEditForm, setShowEditForm] = useState(false); // New state for showing edit form
    
  
    

    const togglePopupForm = () => {

        setShowPopupForm(!showPopupForm);
    };

    const toggleViewForm = (payment) => {
     setSelectedPayment(payment);
        setShowViewForm(!showViewForm);
    };
    useEffect(() => {
        setTimeout(function () {
            setMsg("");
        }, 15000);
        fetchPaymentDetails();
    }, [msg]);
    const handleDelete = (payment_id) => {
        if (window.confirm("Are you sure you want to delete this payment?")) {
            // Use the native fetch API
            fetch(`http://localhost/php/managepayment.php?id=${payment_id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                setMsg(data.message);
                fetchPaymentDetails(); // Refresh the payments list after deletion
                console.log(data);
            })
            .catch(error => {
                console.error('Error deleting payment:', error);
                setMsg("Failed to delete the payment");
            });
        }
    };
    const fetchPaymentDetails = () => {
        fetch(`http://localhost/php/managepayment.php?paymentId=${paymentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tenant details');
                }
                return response.json();

            })
            .then(data => {
                
                
                setPaymentData(data);

            })
            .catch(error => {
                setError(error.message);
            });
    };
    const handleEdit = (unit) => {
       setSelectedPayment(unit); // Set the unit data to be edited
      setShowEditForm(true); // Show the popup
    };

    const handleCloseEdit = () => {
       setSelectedPayment(null); // Clear the unit data
      setShowEditForm(false); // Hide the popup
    };
    const handleUpdate = (updatedPayment) => {
        fetch("http://localhost/php/managepayment.php", {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPayment)
        })
        .then(response => response.json())
        .then(data => {
            setMsg(data.message);
            setShowEditForm(false); // Close the edit payment popup
            fetchPaymentDetails(); // Refresh the payments list after update
        })
        .catch(error => {
            console.error("Error updating payment:", error);
            setMsg("Failed to update the payment");
        });
    };
    
      


    const paymentDatas = paymentData && paymentData.length > 0 ? paymentData.filter(paymentData =>
        paymentData.first_name.toLowerCase().includes(searchTerm.toLowerCase())||
        paymentData.rent_of.toLowerCase().includes(searchTerm.toLowerCase())||
        paymentData.last_name.toLowerCase().includes(searchTerm.toLowerCase())||
        paymentData.payment_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, entriesToShow):  [];

    return (
        <div className="containers">
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="col-lg-12">
                    <div className="row mb-4 mt-4">
                        <div className="col-md-12">

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card3">

                                <div className="card-header2">
                                    <b>List of Tenant Payments</b>
                                    <div className="newtenant" onClick={togglePopupForm}>
                                        <i className="fa fa-plus"><FaPlus /></i> New payment
                                    </div>

                                </div>
                                <div className="card-body">
                                <div className="popup">
  {showPopupForm && <Paymentpopup closePopupForm={togglePopupForm} />}

  {showEditForm && <Editpayment payment={selectedPayment} handleUpdate={handleUpdate} handleClose={handleCloseEdit} />}
                   
         
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
                                                        <th>Tenant</th>
                                                        <th>Rent of</th>
                                                        
                                                        <th>Receipt</th>
                                                        <th>Amount Paid</th>
                                                        <th> Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paymentDatas.map((paymentData, index) => (
                                                        <tr key={index}>
                                                            <td>{paymentData.Date_paid}</td>
                                                            <td>{`${paymentData.first_name} ${paymentData.last_name}`}</td>
                                                            <td>{paymentData.rent_of}</td>
                                                            <td>{paymentData.payment_id}</td>
                                                            <td>{paymentData.Amount_paid}</td>
                                                            <td>
                                                <button className="btn btn-sm btn-primary" onClick={() => toggleViewForm(paymentData)}>
                                                    <FaEye /> View
                                                </button>
                                               
                                                <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(paymentData.payment_id)}>Delete</button>
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(paymentData)}><CiEdit />    Edit</button>
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
