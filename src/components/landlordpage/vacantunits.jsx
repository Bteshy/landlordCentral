import React, { useState, useEffect, useRef } from 'react';
import './rest.css';
import Header from "./header";
import Sidebar from "./sidebar";
import {ReactToPrint} from 'react-to-print';
import { FaPrint } from "react-icons/fa";

export default function Vacantunits() {

    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [vacantunits, setVacantunits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const componentRef = useRef();

    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchVacantunits(); // Fetch units on component mount
    }, [msg]);

    const fetchVacantunits = () => {
        fetch("http://localhost/php/vacantunits.php")
            .then(response => response.json())
            .then(data => { 
                setVacantunits(data); // Assuming your API returns an array of units
            })
            .catch(err => {
                console.error("Error fetching units:", err);
                setError("Failed to load units.");
            });
    };

    const filtereVacantunits = vacantunits.filter(unit =>
        unit.Unit_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.Unit_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.Rent_amount.toString().includes(searchTerm.toLowerCase())||
        unit.Building_id.toString().includes(searchTerm.toLowerCase())
    ).slice(0, entriesToShow);

return (
    <div className="containers">
    <Header/>
    <div className="main-container">
        <Sidebar />
<div className="card6">
                        <div className="card-header"><b>List of Vacant Units</b></div>
                        <div className="card-body">
                            <div className='filter'>
                                <select className='values' value={entriesToShow} onChange={(e) => setEntriesToShow(e.target.value)}>
                                    <option value="5">Show 5</option>
                                    <option value="10">Show 10</option>
                                    <option value="20">Show 20</option>
                                </select>
                                <div className='inputb'>
                                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div className='printrep'>
                                    <ReactToPrint
                                        trigger ={()=>{
                                            return <button type="button" className="btn btn-sm btn-default3" >
                                            <i className='print'><FaPrint /></i>  Print</button>
                                        }}
                                        content={() => componentRef.current} // Pass the ref here
                                      documentTitle={`NEEMA APPARTMENT Vacant units `} 
                                                pageStyle="print"
                                            />
                                        </div>

                                    <div  ref={componentRef}>
                            <table className="table table-condensed table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Unit ID</th>
                                        <th>Unit Type</th>
                                        <th>Rent Amount</th>
                                        <th>Description</th>
                                        <th>Building Id</th>
                            
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtereVacantunits.map((unit) => (
                                        <tr key={unit.Unit_id}>
                                            <td>{unit.Unit_id}</td>
                                            <td>{unit.Unit_type}</td>
                                            <td>{unit.Rent_amount}</td>
                                            <td>{unit.description}</td>
                                            <td>{unit.Building_id}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                                <td colSpan="1" style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Vacant Units:</td>
                                                        <td style={{ fontWeight: 'bold', fontSize: '20px' }}> {filtereVacantunits.length}</td>
                            </table>
                            </div>
                        </div>
                    </div>
                    </div>
                    </div>
)
}
