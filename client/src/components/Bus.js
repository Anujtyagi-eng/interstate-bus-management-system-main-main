import moment from 'moment';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Bus({ bus }) {
    const navigate =useNavigate();
    return (
        <div className='card p-3'>
            <h1 className='text-lg text-primary'>{bus.busnumber}</h1>
            <hr></hr>
            <div className="d-flex justify-content-between">
                <div>
                    <p className='text-sm'>From : </p>
                    <p className='text-sm'>{bus.origin}</p>
                </div>
                <div>
                    <p className='text-sm'>To : </p>
                    <p className='text-sm'>{bus.destination}</p>
                </div>
                <div>
                    <p className='text-sm'>Fare : </p>
                    <p className='text-sm ri-money-rupee-circle-line'>{parseInt(bus.amount)} /-</p>
                </div>
            </div>
            {/* <br /> */}
            <hr />
            <div className="d-flex justify-content-between">
                <div>
                    <p className='text-sm'>Journey Date : </p>
                    <p className='text-sm'>{moment(bus.dates).format('DD-MM-YYYY')}</p>
                </div>
                <div>
                    <p className='text-sm'>Departure TIme : </p>
                    <p className='text-sm'>{bus.departuretime}</p>
                </div>
                <div>
                    <p className='text-sm'>Arrival TIme : </p>
                    <p className='text-sm'>{bus.arrivaltime}</p>
                </div>
            </div>
            <br />
            <h1 className='text-lg underline' onClick={()=>{
                navigate(`/book-now/${bus.busid}`);
            }} style={{color:"rgb(245,155,157)"}}>Book Now</h1>
        </div>
    )
}

export default Bus;