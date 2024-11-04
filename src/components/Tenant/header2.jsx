import React, { useState, useEffect } from 'react';

import bell_icon from '../Assets/bell-regular.svg';
import Profile from './profile.jsx';
import './header2.css';

export default function Header2({ toggleProfile }) {
    const [showPopupForm, setShowPopupForm] = useState(false);

    const togglePopupForm = () => {
        setShowPopupForm(!showPopupForm);
    };
    const [userInfo, setUserInfo] = useState({
        firstname: '',
        lastname:''
       
     });
 
     useEffect(() => {
        
         const loggedInEmail = sessionStorage.getItem('loggedInEmail');
 
         // Retrieve user data from local storage
         const users = JSON.parse(localStorage.getItem('users')) || [];
 
         // Find the user in the local storage whose Email matches the logged-in Email
         const loggedInUser = users.find(user => user.email === loggedInEmail);
 
         // Set the user information if found
         if (loggedInUser) {
             const { firstname,lastname } = loggedInUser;
             setUserInfo({ firstname, lastname });
         } else {
             // Handle case where user is not found (optional)
             console.log('User not found in local storage');
         }
     }, []);
     const getInitials = (firstName, lastName) => {
        return firstName.charAt(0) + lastName.charAt(0);
    };

    return (
        
      
            <div className="Headert">
                <div className='navbar2'>
                    <ul className='navbarul'>
                        <li><a href='#'><img src={bell_icon} alt="" className="bell-icon" /></a></li>
                        <li>
                            <div className="profile-dropdown">
                                <div
                                    className="profile"
                                    onClick={togglePopupForm}
                                >
                                    {getInitials(userInfo.firstname, userInfo.lastname)}
                                </div>
                                {showPopupForm && 
                                    <div className="profile-popup">
                                        <Profile closePopupForm={togglePopupForm} />
                                    </div>
                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }