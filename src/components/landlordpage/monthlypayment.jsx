import React from 'react'
import './rest.css'
import { useState, useEffect, useRef } from 'react';
import Paymentpopup from './paymentpopup';
import Header from "./header";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa6";
import {ReactToPrint} from 'react-to-print';
import { FaPrint } from "react-icons/fa";

export default function PaymentDetails() {
    const [paymentData, setPaymentData] = useState([]);
    const [error, setError] = useState();
    const [paymentId, setpaymentId] = useState();
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const componentRef = useRef(); 
    const [totalAmount, setTotalAmount] = useState(0);
    

    

    useEffect(() => {
        setTimeout(function () {
            setMsg("");
        }, 15000);
        fetchPaymentDetails();
    }, [msg]);
    

    const fetchPaymentDetails = () => {
         fetch(`http://localhost/php/currentmonthpayment.php`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tenant details');
                }
                return response.json();

            })
            .then(data => {
                console.log('Fetched tenant data:', data);
                setPaymentData(data);
                calculateTotalAmount(data);

            })
            .catch(error => {
                setError(error.message);
            });
    };

    // const handleDelete = (tenant_id) => {
    //     if (window.confirm("Are you sure you want to delete this tenant?")) {
    //         // Use the native fetch API
    //         fetch(`http://localhost/php/tenants.php?id=${tenant_id}`, {
    //             method: 'DELETE',
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 setMsg(data.message);
    //                 fetchPaymentDetails(); // Refresh the tenants list after deletion
    //             })
    //             .catch(error => {
    //                 console.error('Error deleting tenant:', error);
    //                 setMsg("Failed to delete the tenant");
    //             });
    //     }
    // };
    const calculateTotalAmount = (data) => {
        let total = 0;
        data.forEach(payment => {
            total += parseFloat(payment.Amount_paid);
        });
        setTotalAmount(total);
    };
    const paymentDatas = paymentData && paymentData.length > 0 ? paymentData.filter(paymentData =>
        paymentData.first_name.toLowerCase().includes(searchTerm.toLowerCase())||
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
                                    <b>payments this month</b>
                                    

                                </div>
                                <div className="card-body">
                                <div className="popup">
 
</div>
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
                                    <div className='printrep'>
                                    <ReactToPrint
                                        trigger ={()=>{
                                            return <button type="button" className="btn btn-sm btn-default3" >
                                            <i className='print'><FaPrint /></i>  Print</button>
                                        }}
                                        content={() => componentRef.current} // Pass the ref here
                                      documentTitle={`NEEMA APPARTMENT payments in  ${new Date().toLocaleString('en-US', { month: 'long' })}`} 
                                                pageStyle="print"
                                            />
                                        </div>

                                    <div  ref={componentRef}>
                                        {paymentData && paymentData.length > 0 ? ( // Check if tenantData is not undefined and has data
                                            <table className="table table-condensed table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th> Date</th>
                                                        <th>Tenant</th>
                                                        <th>Invoice</th>
                                                        <th>Amount Paid</th>
                                                      

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paymentDatas.map((paymentData, index) => (
                                                        <tr key={index}>
                                                            <td>{paymentData.Date_paid}</td>
                                                            <td>{`${paymentData.first_name} ${paymentData.last_name}`}</td>
                                                        
                                                            <td>{paymentData.payment_id}</td>
                                                            <td>{paymentData.Amount_paid}</td>
                                                           
                                        
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="3" style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Amount</td>
                                                        <td style={{ fontWeight: 'bold', fontSize: '20px' }}>{totalAmount}</td>
                                                    </tr>
                                                </tfoot>
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
