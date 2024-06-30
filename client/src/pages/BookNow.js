import { Col, message, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import StripeCheckout from 'react-stripe-checkout';

function BookNow() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bus, setBus] = useState(null);
    const getBus = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/buses/get-bus-by-id', { busid: params.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());

            if (response.data.success) {
                setBus(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    const bookNow = async (paymentid) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/bookings/book-seat', {
                busid: bus[0].busid,
                paymentid,
                seatnumber: selectedSeats
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                navigate('/bookings');
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const onToken = async (token)=>{
        try{
            dispatch(ShowLoading());
            const response =await axios.post('/api/bookings/make-payment',{
                token,
                amount:bus[0].amount * selectedSeats.length*100
            },{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());
            if(response.data.success){
                message.success(response.data.message);
                bookNow(response.data.data.paymentid);
            }else{
                message.error(response.data.message);
            }
        }catch(error){
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    useEffect(() => {
        getBus();
    }, []);
    return (
        <div>
            {bus && (
                <Row className='mt-3' gutter={[30,30]}>
                    <Col lg={12}>
                        <h1 className="text-2xl text-secondary">{bus[0].busnumber}</h1>
                        <h1 className='text-md'>{bus[0].origin}-{bus[0].destination}</h1>
                        <hr />
                        <div className='Flex flex-col gap-1'>
                            <h1 className="text-lg"> Journey date : {moment(bus[0].dates).format('DD-MM-YYYY')}</h1>
                            <h1 className="text-lg"> Departure : {bus[0].departuretime}</h1>
                            <h1 className="text-lg"> Arrival : {bus[0].arrivaltime}</h1>
                            <h1 className="text-lg ">Fare: <p className='ri-money-rupee-circle-line' style={{ display: 'inline' }}>{parseInt(bus[0].amount)} /-</p></h1>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl">
                                Selected Seats : {selectedSeats.join(", ")}
                            </h1>
                            <h1 className="text-2xl mt-2">Total Fare: {bus[0].amount * selectedSeats.length}</h1>
                        </div>
                        <hr />
                        <StripeCheckout billingAddress  token={onToken} amount={bus[0].amount * selectedSeats.length*100} currency="INR"  stripeKey="pk_test_51OwMYUSGkVVnal5ljnMI6Dy9FgpjsSygfONAsnbXqsztGlnd4xWwSUy4ARAyaRsrpZint1kpn8EcJ9ujjzhTY2Rm00i7s0SFer">
                            <button className={`secondary-btn ${selectedSeats.length === 0 && 'disabled-btn'}`} disabled={selectedSeats.length === 0}>Book Now</button>

                        </StripeCheckout>
                    </Col>
                    <Col lg={12}>
                        <SeatSelection
                            selectedSeats={selectedSeats}
                            setSelectedSeats={setSelectedSeats}
                            bus={bus[0]}
                        />
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default BookNow;