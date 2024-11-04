import React, { useState, useEffect, useRef } from 'react';
import { FaPrint } from "react-icons/fa";
import {ReactToPrint} from 'react-to-print';
import './Monthlyreport.css';
import Header from "./header";
import Sidebar from "./sidebar";


export default function Monthlyreport() {
  
    const [error, setError] = useState();
    const [buildings, setBuildings] = useState([]);
    const [buildingid, setBuildingid] = useState('');
    const [reportData, setReportdata] = useState([]);
    const [msg, setMsg] = useState('');
    const [paymentId, setpaymentId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [totalAmount, setTotalAmount] = useState(0);
    const componentRef = useRef(); 
    
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[parseInt(monthNumber, 10) - 1]; // Subtract 1 as months array is zero-indexed
    };
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        setTimeout(function () {
            setMsg("");
        }, 15000);
        fetchReportDetails();
        fetchBuildings();
    }, [msg]);
    useEffect(() => {
        // Calculate total amount whenever report data changes
        calculateTotalAmount();
    }, [reportData]);
    
    

    const fetchBuildings = () => {
        fetch("http://localhost/php/building.php")
            .then(response => response.json())
            .then(data => {
               
                setBuildings(data); // Assuming your API returns an array of buildings
            })
            .catch(err => {
                console.error("Error fetching buildings:", err);
                setError("Failed to load buildings.");
            });
    };

    const fetchReportDetails = () => {
        fetch(`http://localhost/php/report.php?paymentId=${paymentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch report details');
                }
                return response.json();
            })
            .then(data => {
                // console.log("Report Data:", data);
                setReportdata(data);
            })
            .catch(error => {
                setError(error.message);
            });
    };
const handleclear = () =>{

    setBuildingid('');
    setSelectedMonth('');
    fetchReportDetails();
}
    const handleFilter = () => {
    // Clone the original report data array
    let filteredData = [...reportData];

    // Apply all filter conditions
    if (selectedMonth) {
        filteredData = filteredData.filter(
            (data) => getMonthName(data.Date_paid.slice(5, 7)) === selectedMonth
        );
    }

    if (buildingid) {
        filteredData = filteredData.filter(
            (data) => data.Building_id === parseInt(buildingid)
        );
    }

    // Recalculate total amount based on filtered data
    calculateTotalAmount(filteredData);

    // Update the report data state with the filtered data
    setReportdata(filteredData);
};

    const calculateTotalAmount = () => {
        let total = 0;
        reportData.forEach((data) => {
            total += parseFloat(data.Amount_paid);
        });
        setTotalAmount(total);
    };
   
    return (
        <div className="containers">
            <Header />
            <div className=" main-container">
                <Sidebar />
                <div class="col-lg-12">
                    <div class="row mb-4 mt-4">
                        <div class="col-md-12"></div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card3">
                                <div class="card-headerrep">
                                    <div className='filttop'>
                                      
                                        <div className="monthfilt">
                                            <label>Payment month</label>
                                            <select 
    className="monthfilt" 
    value={selectedMonth} 
    onChange={(e) => {
        
        setSelectedMonth(e.target.value);
        // Clear building filter when a new month is selected
        setBuildingid(''); // or setBuildingid('');
    }}
>
                                                     <option value="">Select month</option>
                                                    
                                                {months.map((month, index) => (
                                                    <option key={index} value={month}>{month}</option>
                                                ))}
                                            </select>
                                            <label>Building</label>
                                            <select 
    className="buildingfilt" 
    value={buildingid} 
    onChange={(e) => {
        setBuildingid(e.target.value);
        // Clear month filter when a new building is selected
       // or setSelectedMonth('');
        fetchReportDetails(e.target.value); // Fetch report details for the selected building
    }}
>
                                            <option value="">Select a Building</option>
                                            {buildings.map((building, index) => (
                                                <option key={index} value={building.Building_id}>{building.Building_id}: {building.Building_name} </option>
                                            ))}
                                        </select>
                                        </div>
                                        <div className='filterrep'>
                                            <button type="button" className="btn btn-sm btn-default2" onClick={handleFilter}>Filter</button>
                                            <button type="button" className="btn btn-sm btn-default2" onClick={handleclear}>Clear</button>
                                        </div>
                                    </div>
                                
                                    <div class="card-bodyrep">
                                    <div className='printrep'>
                                    
                                        <ReactToPrint
                                        trigger ={()=>{
                                            return <button type="button" className="btn btn-sm btn-default3" >
                                            <i className='print'><FaPrint /></i>  Print</button>
                                        }}
                                        content={() => componentRef.current} // Pass the ref here
                                      documentTitle={`NEEMA APPARTMENT Rental Payment Report for  ${selectedMonth}`} 
                                                pageStyle="print"
                                            />
                                        </div>
    
                                        <div ref={componentRef}>
                                            {reportData && reportData.length > 0 ? (
                                                <table class="table table-condensed table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th> Date Paid</th>
                                                            <th>Tenant</th>
                                                            <th>Building</th>
                                                            <th>Unit</th>
                                                            <th>Invoice</th>
                                                            <th>Amount payed</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reportData.map((reportData, index) => (
                                                            <tr key={index}>
                                                                <td>{reportData.Date_paid}</td>
                                                                <td>{`${reportData.first_name} ${reportData.last_name}`}</td>
                                                                <td>{reportData.Building_name}</td>
                                                                <td>{reportData.Unit_id}</td>
                                                                <td>{reportData.payment_id}</td>
                                                                <td>{reportData.Amount_paid}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                          <td colSpan="5" style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Amount</td>
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
