// EditForm.js

import React, { useState, useEffect } from 'react';
import './rest.css';

const Editbuilding = ({ building, handleUpdate, handleClose }) => {
  const [buildingid, setBuildingId] = useState(building.Building_id);
  const [buildingname, setBuildingName] = useState(building.Building_name);
  const [location, setLocation] = useState(building.Location);

  useEffect(() => {
    setBuildingId(building.Building_id);
    setBuildingName(building.Building_name);
    setLocation(building.Location);
  }, [building]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBuilding = {
      buildingid: buildingid,
     // Assuming the building id doesn't change
      buildingname: buildingname,
      location: location
    };
    handleUpdate(updatedBuilding);
  };

  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Building ID</label>
          <input
            type="text"
            className="form-control"
            value={buildingid}
            onChange={(e) => setBuildingId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Building Name</label>
          <input
            type="text"
            className="form-control"
            value={buildingname}
            onChange={(e) => setBuildingName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-sm btn-default" onClick={handleClose}>Cancel</button>
      </form>
    </div>
  );
};

export default Editbuilding;
