import React, { useState, useEffect } from 'react';

import Header2 from "./header2";
import Sidebar2 from "./sidebar2";
import './dashboard2.css'
import { useNavigate } from 'react-router-dom';

export default function Vacantunits() {

    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [vacantunits, setVacantunits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const naviget =useNavigate();

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
    <Header2/>
    <div className="main-container">
        <Sidebar2 />
<div className="card6">
                        <div className="card-header"><b>List of Available Units</b></div>
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
                            <table className="table table-condensed table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Unit ID</th>
                                        <th>Unit Type</th>
                                        <th>Rent Amount</th>
                                        <th>Description</th>
                                        <th>Building Id</th>
                                        <th class="">Action</th>
                            
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
                                            
                                            <td> <button className="btn btn-sm btn-primary2" onClick={() => naviget(`/tenantdetails?unitId=${unit.Unit_id}`)}>Intrested? Make payment</button>
</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                    </div>
)
}
