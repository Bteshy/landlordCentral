import React, { useState, useEffect } from 'react';
import './rest.css';

const EditPayment = ({ payment, handleUpdate, handleClose }) => {
  const [paymentId, setPaymentId] = useState(payment.payment_id);
  const [amountPaid, setAmountPaid] = useState(payment.Amount_paid);
  const [datePaid, setDatePaid] = useState(payment.Date_paid);
  const [rentOf, setRentOf] = useState(payment.rent_of);

  useEffect(() => {
    setPaymentId(payment.payment_id);
    setAmountPaid(payment.Amount_paid);
    setDatePaid(payment.Date_paid);
    setRentOf(payment.rent_of);
  }, [payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPayment = {
      payment_id: paymentId,
      Date_paid: datePaid,
      Amount_paid: amountPaid,
      rent_of: rentOf,
    };
    handleUpdate(updatedPayment);
  };
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const maxDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};


  return (
    <div className="edit-form3">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Payment ID</label>
          <input
            type="text"
            className="form-control"
            value={paymentId}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Date Paid</label>
          <input
            type="date"
            className="form-control"
            value={datePaid} max={maxDate()}
            onChange={(e) => setDatePaid(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Amount Paid</label>
          <input
            type="number"
            className="form-control"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Month for Rent</label>
          <select className="form-control" value={rentOf} onChange={(e) => setRentOf(e.target.value)}>
    <option value="">Select Month</option>
    {months.map((month, index) => (
        <option key={index} value={month}>{month}</option>
    ))}
</select>
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-sm btn-default" onClick={handleClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditPayment;
