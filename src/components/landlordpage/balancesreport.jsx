import React, { useState, useEffect, useRef } from 'react';
import { FaPrint } from "react-icons/fa";
import { ReactToPrint } from 'react-to-print';
import './Monthlyreport.css';
import Header from "./header";
import Sidebar from "./sidebar";

export default function Balancereport() {
    const [error, setError] = useState();
    const [reportData, setReportData] = useState([]);
    const [msg, setMsg] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const componentRef = useRef();
    const [totalAmount, setTotalAmount] = useState(0);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    useEffect(() => {
        // Calculate total amount whenever report data changes
        calculateTotalAmount();
    }, [reportData]);

    useEffect(() => {
        setTimeout(function () {
            setMsg("");
        }, 15000);
        fetchReportDetails();
    }, [msg]);
    useEffect(() => {
        setTimeout(function () {
            setMsg("");
        }, 15000);
        fetchReportDetails();
    }, [selectedMonth]);

    const fetchReportDetails = () => {
        fetch(`http://localhost/php/balancereport.php?rent_of=${selectedMonth}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch report details');
                }
                return response.json();
            })
            .then(data => {
            
                setReportData(data);
                console.log('rent' ,data)
            })
            .catch(error => {
                setError(error.message);
            });
    };
    const countTenantsWithBalance = () => {
        let count = 0;
        reportData.forEach((data) => {
            if (data.latest_outstanding_balance !== "cleared" && parseFloat(data.latest_outstanding_balance) > 0) {
                count++;
            }
        });
        return count;
    };
    
    // Use the countTenantsWithBalance function to calculate the count
    const positiveBalanceCount = countTenantsWithBalance();
    
    const calculateTotalAmount = () => {
        let total = 0;
        reportData.forEach((data) => {
            if (data.latest_outstanding_balance === "cleared") {
                total += 0; // Treat "cleared" as 0
            } else {
                total += parseFloat(data.latest_outstanding_balance);
            }
        });
        setTotalAmount(total);
    };
  
    return (
        <div className="containers">
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="col-lg-12">
                    <div className="row mb-4 mt-4">
                        <div className="col-md-12"></div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card3">
                                <div className="card-headerrep">
                                    <div className='filttop'>
                                        <div className="monthfilt">
                                        <select value={selectedMonth} onChange={handleMonthChange}>
    <option value="">Select Month</option>
    {months.map((month, index) => (
        <option key={index} value={month}>{month}</option>
    ))}
</select>

                                        </div>
                                    </div>
                                    <div className="card-bodyrep">
                                        <p><b>RENT BALANCES</b></p>
                                        <div className='printrep'>
                                            <ReactToPrint
                                                trigger={() => {
                                                    return <button type="button" className="btn btn-sm btn-default3">
                                                        <i className='print'><FaPrint /></i>  Print</button>
                                                }}
                                                content={() => componentRef.current}
                                                documentTitle= {`NEEMA APPARTMENT Rental balance report for  ${selectedMonth}`}
                                                pageStyle="print"
                                            />
                                        </div>
                                        <div ref={componentRef}>
                                            {reportData && reportData.length > 0 ? (
                                                <table className="table table-condensed table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Tenant</th>
                                                            <th>Unit</th>
                                                            <th>Total amount paid</th>
                                                            <th>Last payment</th>
                                                            <th>Outstanding balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reportData.map((reportData, index) => (
                                                            <tr key={index}>
                                                                <td>{`${reportData.first_name} ${reportData.last_name}`}</td>
                                                                <td>{reportData.Unit_id}</td>
                                                                <td>{reportData.total_amount_paid}</td>
                                                                
                                            
                                                                <td>{reportData.latest_payment_date}</td>
                                                                <td>{reportData.latest_outstanding_balance}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                    <td colSpan="1" style={{ fontWeight: 'bold', fontSize: '20px' }}>Tenants with rent Arrears:</td>
                    <td style={{ fontWeight: 'bold', fontSize: '20px' }}>{positiveBalanceCount}</td>
                </tr>
                                                    <tr>
                                                          <td colSpan="1" style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Outstanding Balance:</td>
                                                          <td style={{ fontWeight: 'bold', fontSize: '20px'}}>{totalAmount}</td>
                                                     </tr>
                                                    </tfoot>
                                                </table>
                                            ) : (
                                                <div>No data</div>
                                            )}
                                        </div>
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
