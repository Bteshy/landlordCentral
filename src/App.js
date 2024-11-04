// App.js
import React from 'react';
import './index.css';
import './App.css';
import Signup from './components/Sigup/signup.jsx';
import Login from './components/login/login.jsx';
import Layout from './components/landlordpage/layout.jsx';
import Building from './components/landlordpage/Building.jsx';
import Payment from './components/landlordpage/payment.jsx';
import Reports from './components/landlordpage/reports.jsx';
import Monthlyreport from './components/landlordpage/Monthlyreport.jsx';
import Monthlypayment from './components/landlordpage/monthlypayment.jsx';
import Balancereport from './components/landlordpage/balancesreport.jsx';
import Tenants from './components/landlordpage/tenants.jsx';
import Viewinvoice from './components/landlordpage/viewinvoice.jsx';
import Unit from './components/landlordpage/unit.jsx';
import Vacantunits from './components/landlordpage/vacantunits.jsx';
import Maintenancerequest from './components/Tenant/maintenancerequest.jsx';
import Maintenance from './components/landlordpage/maintenance.jsx';
import Dashboard from './components/landlordpage/dashboard.jsx';
import Activetenants from './components/landlordpage/activetenants.jsx';
import Sidebar2 from './components/Tenant/sidebar2.jsx';
import Profile from './components/Tenant/profile.jsx';
import Tenantpayment from './components/Tenant/tenantpayment.jsx';
import Tenantdetails from './components/Tenant/tenantdetails.jsx';
import Header2 from './components/Tenant/header2.jsx';
import Individualpay from './components/Tenant/individualpay.jsx';
import Dashboard2 from './components/Tenant/dashboard2.jsx';
import Landingpage from './components/landingpage/landingpage.jsx';
import Landing from './components/landingpage/landing.jsx';
import { BrowserRouter,Routes,Route} from 'react-router-dom';



const App = () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path= '/' element = {<Landingpage/>}></Route>
    <Route path= '/landing' element = {<Landing/>}></Route>
      <Route path= '/signup' element = {<Signup/>}></Route>
      <Route path= '/login' element = {<Login/>}></Route>
      <Route path= '/building' element = {<Building/>}></Route>
      <Route path= '/payment' element = {<Payment/>}></Route>
      <Route path= '/dashboard' element = {<Dashboard/>}></Route>
      <Route path= '/reports' element = {<Reports/>}></Route>
      <Route path= '/viewinvoice' element = {<Viewinvoice/>}></Route>
      <Route path= '/Monthlyreport' element = {<Monthlyreport/>}></Route>
      <Route path= '/monthlypayment' element = {<Monthlypayment/>}></Route>
      <Route path= '/maintenance' element = {<Maintenance/>}></Route>
      <Route path= '/balancereport' element = {<Balancereport/>}></Route>
      
      <Route path= '/dashboard2' element = {<Dashboard2/>}></Route>
      <Route path= '/sidebar2' element = {<Sidebar2/>}></Route>
      <Route path= '/layout' element = {<Layout/>}></Route>
      <Route path= '/tenants' element = {<Tenants/>}></Route>
      <Route path= '/unit' element = {<Unit/>}></Route>
      <Route path= '/vacantunits' element = {<Vacantunits/>}></Route>
      <Route path= '/maintenancerequest' element = {<Maintenancerequest/>}></Route>
      <Route path= '/profile' element = {<Profile/>}></Route>
      <Route path= '/tenantpayment' element = {<Tenantpayment/>}></Route>
      <Route path= '/tenantdetails' element = {<Tenantdetails/>}></Route>
      <Route path= '/header2' element = {<Header2/>}></Route>
      <Route path= '/activetenants' element = {<Activetenants/>}></Route>
      <Route path= '/individualpay' element = {<Individualpay/>}></Route>



    
    </Routes>
    </BrowserRouter>
      
  );
};

export default App;
