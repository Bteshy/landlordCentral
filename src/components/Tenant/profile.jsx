import React, { useState, useEffect } from 'react';
import './profile.css';

export default function ProfilePage({ closeProfile }) {
    const [userInfo, setUserInfo] = useState({
        firstname: '',
        lastname: '',
        email: '',
        contact: ''
    });

    useEffect(() => {
        const loggedInEmail = sessionStorage.getItem('loggedInEmail');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const loggedInUser = users.find(user => user.email === loggedInEmail);
        if (loggedInUser) {
            const { firstname, lastname, email, contact } = loggedInUser;
            setUserInfo({ firstname, lastname, email, contact });
        } else {
            console.log('User not found in local storage');
        }
    }, []);

    const getInitials = (firstName, lastName) => {
        return firstName.charAt(0) + lastName.charAt(0);
    };
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserInfo(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  

    return (
        <div className="profile-page">
            <div className="headerprof">
                <h1>My Profile</h1>
            </div>
            <div className="contentprof">
                <div className="profile-dropdown">
                    <div className="profile">
                        {getInitials(userInfo.firstname, userInfo.lastname)}
                    </div>
                </div>
                <div className="profile-info">
                    <div className="info-row">
                        <span className="label">Name:</span>
                        <span className="value">{userInfo.firstname} {userInfo.lastname}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Email:</span>
                        <span className="value">{userInfo.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Phone number:</span>
                        <span className="value">{userInfo.contact}</span>
                    </div>
                </div>
               
            </div>
        </div>
    );
}
