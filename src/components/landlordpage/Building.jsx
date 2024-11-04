import React from 'react';
import './rest.css';
import { useState,useEffect} from 'react';
import Header from "./header";
import Sidebar from "./sidebar";
import Editbuilding from "./editbuilding";
export default function Building() {
   
    const[buildingid,setBuildingid] = useState ('');
    const[buildingname,setBuildingname] = useState ('');
    const[location,setLocation] = useState ('');
    const[error, setError] = useState('');
    const[msg, setMsg] = useState('');
    const [buildings, setBuildings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    
    useEffect(() => {
        setTimeout(function(){
            setMsg("");
        }, 15000);
        fetchBuildings(); // Fetch buildings on component mount
    }, [msg]);

    const handleInputChange =(e, type)=> {

    switch(type){
        case "buildingid":
            setError("");
            setBuildingid(e.target.value);
            if(e.target.value === ""){
                setError("buildingid is left blank!");
            }
            break;
        case "buildingname":
            setError("");
            setBuildingname(e.target.value);
            if(e.target.value === ""){
                setError("Buildingname is left blank!");
            }
            break;
            case "location":
            setError("");
            setLocation(e.target.value);
            if(e.target.value === ""){
                setError("location is left blank!");
            }
            break;
        default:
    }
}
const fetchBuildings = () => {
  fetch("http://localhost/php/building.php")
      .then(response => response.json())
      .then(data => { 
        
          setBuildings(data); // Assuming your API returns an array of buildings
          console.log()
      })
      .catch(err => {
       
          console.error("Error fetching buildings:", err);
          setError("Failed to load buildings.");
      });
};

    function handleSubmit(e){
    e.preventDefault()
        if(buildingid!== "" && buildingname !== "" && location!== ""){
            
        var url = "http://localhost/php/building.php";
        var headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        var Data = {
            buildingid:buildingid,
            buildingname:buildingname,
            location: location
            
        }
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(Data)
        }).then((response) => response.json())
        .then((response) => {
            setMsg(response[0].result);
         }).catch((err) =>{
            setError(err);
            console.log(err);
        });
        clearForm();
        

    }
    else{
        setError("All fields are required")
    }
}
const clearForm = () => {
    setBuildingid('');
    setBuildingname('');
    setLocation('');
  };

  const handleDelete = (Building_id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
        // Use the native fetch API
        fetch(`http://localhost/php/building.php?id=${Building_id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            setMsg(data.message);
            fetchBuildings(); // Refresh the building list after deletion
        })
        .catch(error => {
            console.error('Error deleting building:', error);
            setMsg("Failed to delete the building");
        });
    }
};
const handleEdit = (building) => {
    setSelectedBuilding(building);
    setShowEditForm(true);
};
const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedBuilding(null);
};
const handleUpdate = (updatedBuilding) => {
    fetch("http://localhost/php/building.php", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedBuilding) // Ensure updatedBuilding contains buildingid, buildingname, and location
    })
    .then(response => response.json())
    .then(data => {
      // Handle response from backend
      console.log(data);
      // Optionally, show success or error message to the user
      setMsg(data.message);
      // Close the edit form
      setShowEditForm(false);
      // Refresh the building list
      fetchBuildings();
    })
    .catch(error => {
      console.error("Error updating building:", error);
      // Optionally, show error message to the user
      setMsg("Failed to update the building");
    });
};


const filteredBuildings = buildings.filter(building =>
    building.Building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.Location.toLowerCase().includes(searchTerm.toLowerCase())
).slice(0, entriesToShow);
  // console.log(buildings);

  return (
    
    <div className = "containers">
  <Header/>
 <div className = " main-container">
 <Sidebar />
 
    <div className="container-fluid building-container">
      <div className="row flex-container">
        
          <form id="manage-building">
            <div className="card">
            <p>
                          {
                              msg !== "" ?
                              <span className="success">{msg}</span> :
                              <span className="error">{error.toString()}</span>
                          }
                      </p>
              <div className="card-header"><b>Building Form</b></div>
              <div className="card-body">
                <div className="form-group" id="msg"></div>
                <div className="form-group">
                  <label>Building ID</label>
                  <input type="text" className="form-control"
                    onChange={(e) => handleInputChange(e, "buildingid")}
                    value={buildingid} />
                </div>
                <div className="form-group">
                  <label>Building Name</label>
                  <input type="text" className="form-control" 
                    onChange={(e) => handleInputChange(e, "buildingname")}
                    value={buildingname} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" className="form-control" 
                  onChange={(e) => handleInputChange(e, "location")}
                  value={location} />
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-sm btn-primary" onClick={handleSubmit}>Save</button>
                <button type="button" className="btn btn-sm btn-default" onClick={clearForm}>Cancel</button>
              </div>
            </div>
          </form>
          <div className="popupb">
          {showEditForm && <Editbuilding building={selectedBuilding} handleUpdate={handleUpdate} handleClose={handleCloseEditForm} />}
          </div>
    
          <div class="col-lg-12">
		<div class="row mb-4 mt-4">
			<div class="col-md-12">
				
			</div>
		</div>
		<div class="row">
						<div class="col-md-12">
				<div class="card2">
                    
					<div class="card-header">
						<b>List of Buildings</b>
             
					</div>
                    <div class="card-body">
                    <div className='filter'>
                    <select className ='values 'value={entriesToShow} onChange={(e) => setEntriesToShow(e.target.value)}>
                            <option value="5">Show 5</option>
                            <option value="10">Show 10</option>
                            <option value="20">Show 20</option>
                        </select>
                        <div className='inputb'>
    <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  />
        </div>
    
                    </div>
					
						<table class="table table-condensed table-bordered table-hover">
							<thead>
								<tr>
									
									<th class="">Building id</th>
									<th class="">Building Name</th>
									<th class="">Location</th>
                  <th class="">Action</th>
								</tr>
							</thead>
							<tbody>
                {
     filteredBuildings.map((building) => (
      <tr key={building.Building_id}>
        <td>{building.Building_id}</td>
        <td>{building.Building_name}</td>
        <td>{building.Location}</td>
        <td> <button className="btn btn-sm btn-primary" onClick={() => handleEdit(building)}>Edit</button>
             <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(building.Building_id)}>Delete</button>
        </td>
      </tr>
    ))
    }
                </tbody>
                </table>
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
