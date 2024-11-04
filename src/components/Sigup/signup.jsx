import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import key_icon from '../Assets/key-solid.svg';
import user_icon from '../Assets/user-solid.svg';
import envelope_icon from '../Assets/envelope-solid.svg';
import phone_icon from '../Assets/phone-solid.svg';

export default function Signup() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        });
        // Reset error message for current input
        if (error) setError('');
    };

    const validateForm = () => {
        const { firstname, lastname, email, contact, password, password2 } = userDetails;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        
        if (!firstname || !lastname || !email || !contact || !password || password !== password2) {
            setError("All fields are required and passwords must match.");
            return false;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return false;
        }
        
        if (!phoneRegex.test(contact)) {
            setError("Invalid phone number.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        checkEmail();

        // Assuming the backend API is correctly set to handle the request.
        const url = "http://localhost/php/signup.php";
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        })
        .then((response) => response.json())
        .then((response) => {
            setMsg("Signup successful. Redirecting to login...");
            // Store data in local storage
            localStorage.setItem("email", userDetails.email);
            localStorage.setItem("contact", userDetails.contact);
            localStorage.setItem("user_id", response.user_id); // Assuming the response contains user_id
            // Redirect to login page after a delay
            signUp(userDetails, response.user_id);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        })
        .catch((err) => {
            setError("An error occurred. Please try again.");
            console.error(err);
        });
    };
    function signUp(userDetails, user_id) {
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = [...existingUsers, { ...userDetails, user_id }];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    // Assuming the backend API is correctly set to handle the request.
     const checkEmail = () => {
    const url = "http://localhost/php/checkemail.php";
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    const data = {
        email: userDetails.email
    };
    
    fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((response) => {
        const result = response[0].result;
        console.log(response[0].result)
        if (result === "") {
            // If email is not already registered, proceed with signup
            signUp();
        } else {
            setError(result);
        }
    })
    .catch((err) => {
        setError("An error occurred. Please try again.");
        console.error(err);
    });
};

    return (
        <form className='container' onSubmit={handleSubmit}>
            <p>{msg ? <span className="success">{msg}</span> : <span className="error">{error}</span>}</p>
            <div className='Headerlog'>
                <div className='text'>Create New<br />Account</div>
            </div>
            <div className='inputs'>
                {[
                    { name: 'firstname', icon: user_icon, placeholder: 'First name' },
                    { name: 'lastname', icon: user_icon, placeholder: 'Last name' },
                    { name: 'email', icon: envelope_icon, placeholder: 'Email' },
                    { name: 'contact', icon: phone_icon, placeholder: 'Phone number' },
                    { name: 'password', icon: key_icon, placeholder: 'Password', type: 'password' },
                    { name: 'password2', icon: key_icon, placeholder: 'Confirm password', type: 'password' }
                ].map((input, index) => (
                    <div className='input' key={index}>
                        <img src={input.icon} alt="" />
                        <input
                            type={input.type || "text"}
                            name={input.name}
                            id={input.name}
                            placeholder={input.placeholder}
                            onChange={handleInputChange}
                            value={userDetails[input.name]}
                        />
                    </div>
                ))}
            </div>
            <div className="Submit">
                <button className="Signup" type="submit">Sign Up</button>
            </div>
            <div className="Registered">
                Already Registered? <span onClick={() => navigate('/login')}>Login Here</span>
            </div>
        </form>
    );
}
