import React, { useState, useEffect } from 'react';
import './rest.css';
import Header from "./header";
import Sidebar from "./sidebar";
import EditUnit from './editunit';

export default function Unit() {
   
    const [unitid, setUnitid] = useState('');
    const [unittype, setUnittype] = useState('');
    const [rentamount, setRentamount] = useState('');
    const [description, setDescription] = useState('');
    const [buildingid, setBuildingid] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [units, setUnits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [selectedUnit, setSelectedUnit] = useState(null); 
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchUnits(); // Fetch units on component mount
    }, [msg]);

    const handleInputChange = (e, type) => {
        setError('');
        const value = e.target.value;
        switch (type) {
            case 'unitid':
                setUnitid(value);
                break;
            case 'unittype':
                setUnittype(value);
                break;
            case 'rentamount':
                setRentamount(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'buildingid':
                    setBuildingid(value);
                    break;
            default:
                break;
        }
    };

    const fetchUnits = () => {
        fetch("http://localhost/php/units.php")
            .then(response => response.json())
            .then(data => { 
                setUnits(data); // Assuming your API returns an array of units
            })
            .catch(err => {
                console.error("Error fetching units:", err);
                setError("Failed to load units.");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (unitid !== '' && unittype !== '' && rentamount !== '' && description !== '') {
            const url = "http://localhost/php/units.php";
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            const data = {
                unitid: unitid,
                unittype: unittype,
                rentamount: rentamount,
                description: description,
                buildingid: buildingid
            };
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((response) => {
                setMsg(response[0].result);
                clearForm();
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
        } else {
            setError("All fields are required");
        }
    };

    const clearForm = () => {
        setUnitid('');
        setUnittype('');
        setRentamount('');
        setDescription('');
        setBuildingid('');
    };

    const handleDelete = (unit_id) => {
        if (window.confirm("Are you sure you want to delete this unit?")) {
            fetch(`http://localhost/php/units.php?id=${unit_id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                setMsg(data.message);
                fetchUnits(); // Refresh the units list after deletion
            })
            .catch(error => {
                console.error('Error deleting unit:', error);
                setMsg("Failed to delete the unit");
            });
        }
    };

    const handleEdit = (unit) => {
        setSelectedUnit(unit); // Set the unit data to be edited
        setShowPopup(true); // Show the popup
    };

    const handleCloseEdit = () => {
        setSelectedUnit(null); // Clear the unit data
        setShowPopup(false); // Hide the popup
    };
    const handleUpdate = (updatedUnit) => {
       fetch("http://localhost/php/units.php",{
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUnit)  
        })

        .then(response => response.json())
        .then(data => {
            console.log(data);
            setMsg(data.message);
            setShowPopup(false);
            fetchUnits(); // Refresh the units list after update
            // Close the edit unit popup
        })
        .catch(error => {
            console.error("Error updating unit:", error);
            // Optionally, show error message to the user
            setMsg("Failed to update the unit");
          });
      };
      
    
    const filteredUnits = units.filter(unit =>
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
                <div className="container-fluid unit-container">
                    <form id="manage-building">
                        <div className="card">
                            <p>
                                {
                                    msg !== "" ?
                                    <span className="success">{msg}</span> :
                                    <span className="error">{error}</span>
                                }
                            </p>
                            <div className="card-header"><b>Unit Form</b></div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Unit ID</label>
                                    <input type="text" className="form-control" onChange={(e) => handleInputChange(e, "unitid")} value={unitid} />
                                </div>
                                <div className="form-group">
                                    <label>Unit Type</label>
                                    <select className="form-control" onChange={(e) => handleInputChange(e, "unittype")} value={unittype}>
                                    <option value="" style={{ color: 'grey' }}>Select Unit Type</option>
                                        <option value="Bedsitter">Bedsitter</option>
    <option value="1 Bedroom">1 Bedroom</option>
    <option value="2 Bedroom">2 Bedroom</option>
    <option value="Single room">Single room</option>
    <option value="Double room">Double room</option>
                                      
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-control" onChange={(e) => handleInputChange(e, "description")} value={description}
    placeholder="Enter description..."
    rows={3} // Adjust the number of rows as needed
/>

                                </div>
                                <div className="form-group">
                                    <label>Rent Amount</label>
                                    <input type="text" className="form-control" onChange={(e) => handleInputChange(e, "rentamount")} value={rentamount} />
                                </div>
                                <div className="form-group">
                                    <label>Building Id</label>
                                    <input type="text" className="form-control" onChange={(e) => handleInputChange(e, "buildingid")} value={buildingid} />
                                </div>
                                
                           
                            <div className="card-footer">
                                <button type="submit" className="btn btn-sm btn-primary" onClick={handleSubmit}>Save</button>
                                <button type="button" className="btn btn-sm btn-default" onClick={clearForm}>Cancel</button>
                            </div>
                             </div>
                        </div>
                    </form>
                    <div className="popupu">
                    {showPopup && <EditUnit unit={selectedUnit} handleUpdate={handleUpdate} handleClose={handleCloseEdit} />}
                   
          </div>
                    <div className="card2">
                        <div className="card-header"><b>List of Units</b></div>
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUnits.map((unit) => (
                                        <tr key={unit.Unit_id}>
                                            <td>{unit.Unit_id}</td>
                                            <td>{unit.Unit_type}</td>
                                            <td>{unit.Rent_amount}</td>
                                            <td>{unit.description}</td>
                                            <td>{unit.Building_id}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(unit)}>Edit</button>
                                                <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(unit.Unit_id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
