import React from 'react'
import './landingpage.css'
import { Link } from 'react-router-dom';

import logo_icon from '../Assets/Group 46.svg'
import line from '../Assets/Line 13.svg'
import art from '../Assets/Group 45.svg'
import unit1 from '../Assets/Rectangle 58.svg'
import unit2 from '../Assets/Rectangle 60.svg'
import unit3 from '../Assets/Rectangle 61.svg'
import unit4 from '../Assets/Rectangle 59.svg'
import contact1 from '../Assets/Group 6.svg'
import contact2 from '../Assets/Group 8.svg'
import contact3 from '../Assets/Group 9.svg'
import footer1 from '../Assets/Group 48.svg'
import footer2 from '../Assets/Group 47.svg'
import footer3 from '../Assets/Group 49.svg'
import footer4 from '../Assets/Group 52.svg'
import footer5 from '../Assets/Group 53.svg'
import landhouse from '../Assets/house-solid.svg'



const landingpage = () => {
    return (
  <div className = "landingpage">
    <div className = "Header10">
        <div className ="logo"> <img src ={logo_icon} alt=""/>
         </div>
        <div className='navbar'>
          <ul className = 'navbarul'>
            <li><a href = '#Home'>Home</a></li>
            <li><a href = '#viewproperty'>View property</a></li>
            <li><a href = '#contact'>Contact</a></li>
      
          </ul>
          <div className='buttons'>
              <Link to ='login'><button>Login</button></Link>
              <Link to ='signup'><button>Register</button></Link>
            </div>
            
            </div>
    </div>
    

    <div id = "Home">
      <div className= 'content'>
        <div className ='welcome'>
          <p className ='top'>Welcome to Neema Appartments</p>
          
          <p className ='bottom'>
             <img src ={line} alt=""/> <span>We're delighted to have you here with us. At Neema Apartments, we strive to provide more than just a place to stay; we aim to create a warm and inviting community where every resident feels at home.

As you step into our space, you'll find comfort, convenience, and a friendly atmosphere awaiting you. Whether you're here for a short visit or planning to make Neema Apartments your long-term residence, we want your experience to be nothing short of exceptional..</span> </p>
        </div>
        <div className='Art'>  <img src ={art} alt=""/></div>
      </div>
    </div>
    
    


    <div id= "viewproperty">
      <div className = "property">
        <p className='first'><b>What are you looking for?</b><br></br><br></br> <span>
        


🏡 Discover Your Perfect Space

Welcome to our collection of beautifully designed apartments! Whether you're seeking the cozy intimacy of a single-room sanctuary or the spacious comfort of a two-bedroom haven, we have just the right space for you. </span> </p>
        <div className='units'> 
        <div className='twobed'><img src ={unit1} alt=""/>
        <p>Two bedroom</p></div>
        <div className='bedsit'><img src ={unit2} alt=""/>
        <p>Bedsitter</p></div>
        <div className='single'><img src ={unit3} alt=""/>
        <p>Singleroom</p></div>
        <div className='onebed'><img src ={unit4} alt=""/>
        <p>One bedroom</p></div>
        </div>
      </div>
    </div>

    <div id ="contact">
    
      <div className ='details'>
        <div className='contacticons'>
        <p className = 'title'>Contact info</p>
        <img src ={contact1} alt=""/>
        <img src ={contact3} alt=""/>
        <img src ={contact2} alt=""/>
           </div>
       
          <div className='contacttext'>
          <p className='ctext1'>Address Location<br></br><span>Bomet county </span></p>
          <p className='ctext2'>Phone Number<br></br><span>0710626278 </span></p>
          <p className='ctext3'>Mail Address<br></br><span>joyrot123@gmail.com </span></p>
          </div>
          <div className ='map'> <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31915.57777480747!2d35.31550848856464!3d-0.7814640994989739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182b9965358e7383%3A0x4e506b0d94574dab!2sBomet%20University%20College!5e0!3m2!1sen!2ske!4v1707050662908!5m2!1sen!2ske"
  width="600"
  height="450"
  style={{ border:0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

</div>
      

      </div>
    </div>

   
      <div className= 'footerdetails'>
        <div className = 'Appartment'>
        <img src ={footer3} alt=""/> 
          <p className = 'ftext1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel consequat tortor. </p>
          <div className='ftext2'><p> <b>Follow us</b></p>
          <img src ={footer1} alt=""/>
          </div>
        </div>
        <div className='quicklink'>
        <img src ={footer4} alt=""/>
        <ul>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
        </div>
        <div className='galary'>
        <img src ={footer5} alt=""/>
        <img src ={footer2} alt=""/>

        </div>
      </div>
    </div>

 
  
        );

    };
        
    export default landingpage