import React from 'react'
import './viewinvoice.css'
import {ReactToPrint} from 'react-to-print';
import { FaPrint } from "react-icons/fa";
import { useRef } from 'react';
export default function Viewinvoice({ 
    first_name,
    last_name,
    payment_id,
    email,
    phone_number,
    Date_paid,
    rent_of,
    Amount_paid,
    Outstanding_balance,
    Unit_id,
    closePopupForm,
    
}) {
    const componentRef = useRef(); 
    
return(<>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css"
    integrity="sha256-2XFplPlrFClt0bIdPgpz8H7ojnk10H69xRqd9+uTShA="
    crossOrigin="anonymous"
  />
  
  <div className="containerinvo" ref={componentRef}>
    
      <div className="col-lg-12">
        <div className="cardinvo">
          <div className="cardinvo-body">
            <div className="invoice-title">
           <div className= "Tenantdetails">
              <div className="mb-4">
                <h2 className="mb-4 text-muted">Neema Appartments</h2>
              </div>
              <div className="text-muted">
                <p className="mb-1">Bomet Po box 9</p>
            
                <p>
                  <i className="uil uil-phone me-1" /> 0710626278
                </p>
              </div>
            </div>
            <div className="invoice">
  <h4 className="font-size-15">
    Receipt  {payment_id} paid{"   "} 
  </h4>

</div> 

            </div>
            <hr className="my-4" />
            <div className="row">
              <div className="col-sm-6">
                <div className="moredet">
                    <h5 className= "font-size-16 mb-3">Tenant: </h5>
                  <p className="font-size-16 mb-3"> {first_name} {last_name}</p>
                  <p className=" font-size-16 mb-1">{email}</p>
                  <p>{phone_number}</p>
                </div>
              </div>
              {/* end col */}
              <div className="col-sm-6">
                <div className="text-muted text-sm-end">
                  <div>
                    <h5 className="font-size-15 mb-1">Receipt No:   <span>{payment_id} </span> </h5>
                    
                  </div>
                  <div className="mt-4">
                    <h5 className="font-size-15 mb-1"> Date:   </h5>
                    <p>{Date_paid}</p>
                  </div>
                 
                </div>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
            <div className="py-2">
              <h5 style={{ marginLeft: '20px' }}>Details for<span> Unit: {Unit_id} </span></h5>
              <div className="table-responsive">
                <table className="table align-middle table-nowrap table-centered mb-0">
                  
                
                  <tbody>
                    
                   
                    <tr>
                      
                    <th> payment for  {rent_of} </th>
                    <th> Amount  </th>
                    <th> Balance  for: {rent_of} </th>
                       
                      </tr>
                    
                   <tr>
                        <td>  </td>
                       
                       
                  <td> {Amount_paid}</td>
                
                  
                  <td>{Outstanding_balance}</td>
                  </tr>
                      
                  </tbody>
                  
                </table>
              
              </div>
            
            
            </div>
          </div>
        </div>
      </div>
      {/* end col */}
    </div>
    <div className="card-footerinvo">
                    
                    <button type="button" className="btn btn-sm btn-default" onClick={closePopupForm}>Cancel</button>
                
                <ReactToPrint
                                        trigger ={()=>{
                                            return <button type="button" className="btn btn-sm btn-default3" >
                                            <i className='print'><FaPrint /></i>  Print</button>
                                        }}
                                        content={() => componentRef.current} // Pass the ref here
                                     
                                             
                                            />
                                            </div>

</>
)
}
