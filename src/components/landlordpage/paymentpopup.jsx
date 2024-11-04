import React, { useState, useEffect } from 'react';
import './rest.css';

export default function PaymentPopup({ closePopupForm }) {
    const [amountPaid, setAmountPaid] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [tenant, setTenant] = useState([]);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [rentAmount, setRentAmount] = useState(0);
    const [datePaid, setDatePaid] = useState('');
    const [rentOf, setRentOf] = useState('');

    useEffect(() => {
        fetchTenants();
    }, []);
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


    const fetchTenants = () => {
        fetch("http://localhost/php/tenants.php")
            .then(response => response.json())
            .then(data => {
                setTenant(data);
            })
            .catch(error => {
                console.error("Error fetching tenants:", error);
                setError("Failed to load tenants.");
            });
    };

    useEffect(() => {
        if (tenantId) {
            fetchRentAmount(tenantId);
        }
    }, [tenantId]);

    const fetchRentAmount = (tenantId) => {
        // Assuming the currentMonth is required to fetch the correct rent amount
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
        fetch(`http://localhost/php/rentamount.php?tenantId=${tenantId}&month=${currentMonth}`)
            .then(response => response.json())
            .then(data => {
                setRentAmount(data.Rent_amount);
            })
            .catch(error => {
                console.error("Error fetching rent amount:", error);
                setError("Failed to load rent amount.");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (tenantId && amountPaid && datePaid && rentOf) {
            const url = "http://localhost/php/payment.php";
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            const data = {
                Date_paid: datePaid,
                Amount_paid: amountPaid,
                tenant_id: tenantId,
                rent_of: rentOf
            };
            
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            }).then(response => {
                return response.json();
            }).then(response => {
                setMsg(response.message);
            }).catch(err => {
                setError(err.toString());
            });
            clearForm();
        } else {
            setError("All required fields are needed");
        }
    };

    const clearForm = () => {
        setAmountPaid('');
        setTenantId('');
        setDatePaid('');
        setRentOf('');
        setRentAmount('');
    };

    const maxDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <form className="paymentPopup">
            <div className="card5">
                <p>
                    {msg ? <span className="success">{msg}</span> : <span className="error">{error}</span>}
                </p>
                <div className="card-header3"><b>Payment Form</b></div>
                <div className="card-body4">
                    <div className="form-group3">
                        <label>Tenant</label>
                        <select className="form-control" value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
                            <option key="default" value="">Select Tenant</option>
                            {tenant.map((tenants, index) => (
                                <option key={index} value={tenants.tenant_id}>{tenants.first_name} {tenants.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group3">
                        <label>Monthly Rate</label>
                        <input type="text" className="form-control" value={rentAmount} readOnly />
                    </div>
                    <div className="form-group3">
                    <label>Month for Rent</label>
                    <select className="form-control" value={rentOf} onChange={(e) => setRentOf(e.target.value)}>
    <option value="">Select Month</option>
    {months.map((month, index) => (
        <option key={index} value={month}>{month}</option>
    ))}
</select>
                </div>
                    <div className="form-group3">
                        <label>Amount Paid</label>
                        <input type="number" className="form-control" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
                    </div>
                    <div className="form-group3">
                        <label>Date Paid</label>
                        <input type="date" className="form-control" value={datePaid} max={maxDate()} onChange={(e) => setDatePaid(e.target.value)} />
                    </div>
                </div>
                <div className="card-footer3">
                    <button type="submit" className="btn btn-sm btn-primary" onClick={handleSubmit}>Save</button>
                    <button type="button" className="btn btn-sm btn-default" onClick={closePopupForm}>Cancel</button>
                </div>
            </div>
        </form>
    );
}
