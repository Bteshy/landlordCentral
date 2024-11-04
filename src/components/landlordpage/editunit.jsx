// EditUnitForm.js

import React, { useState, useEffect } from 'react';
import './rest.css';

const EditUnit = ({ unit, handleUpdate, handleClose }) => {
  const [unitid, setUnitId] = useState(unit.Unit_id);
  const [unittype, setUnitType] = useState(unit.Unit_type);
  const [rentamount, setRentAmount] = useState(unit.Rent_amount);
  const [description, setDescription] = useState(unit.description);
  const [buildingid, setBuildingId] = useState(unit.Building_id);

  useEffect(() => {
    setUnitId(unit.Unit_id);
    setUnitType(unit.Unit_type);
    setRentAmount(unit.Rent_amount);
    setDescription(unit.description);
    setBuildingId(unit.Building_id);
  }, [unit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUnit = {
      unitid: unitid,
      unittype: unittype,
      rentamount: rentamount,
      description: description,
      buildingid: buildingid
    };
    handleUpdate(updatedUnit);
  };

  return (
    <div className="edit-form2">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Unit ID</label>
          <input
            type="text"
            className="form-control"
            value={unitid}
            onChange={(e) => setUnitId(e.target.value)}
            readOnly // Assuming the unit id doesn't change
          />
        </div>
        <div className="form-group">
  <label>Unit Type</label>
  <select
    className="form-control"
    value={unittype}
    onChange={(e) => setUnitType(e.target.value)}
  >
    <option value="" style={{ color: 'grey' }}>Select Unit Type</option>
    <option value="Bedsitter">Bedsitter</option>
    <option value="1 Bedroom">1 Bedroom</option>
    <option value="2 Bedroom">2 Bedroom</option>
    <option value="Single room">Single room</option>
    <option value="Double room">Double room</option>
  </select>
</div>
        <div className="form-group">
          <label>Rent Amount</label>
          <input
            type="text"
            className="form-control"
            value={rentamount}
            onChange={(e) => setRentAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Building ID</label>
          <input
            type="text"
            className="form-control"
            value={buildingid}
            onChange={(e) => setBuildingId(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-sm btn-default" onClick={handleClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUnit;
