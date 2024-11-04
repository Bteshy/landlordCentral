// PaymentManager.js
import React, { useState } from 'react';
import TenantPaymentPopup from './TenantPaymentPopup';
import PaymentPopup from '.../PaymentPopup';

export default function PaymentManager() {
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
    const [sharedState, setSharedState] = useState({
        amountPaid: '',
        tenantId: '',
        datePaid: '',
        rentof: '',
        tenantid:''
        // Add more shared state variables as needed
    });

    const updateSharedState = (updatedState) => {
        setSharedState(prevState => ({
            ...prevState,
            ...updatedState
        }));
    };

    return (
        <div>
            <TenantPaymentPopup
                sharedState={sharedState}
                updateSharedState={updateSharedState}
            />
            <PaymentPopup
                sharedState={sharedState}
                updateSharedState={updateSharedState}
            />
        </div>
    );
}
