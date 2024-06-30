import React, { useEffect, useState } from 'react';
import { Row, Col, message } from 'antd';
import '../resources/bus.css';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
    const capacity = bus.capacity;
    const params = useParams();
    const dispatch = useDispatch();
    const [BookedSeat, setBookedSeat] = useState([]);

    // get booked seat from backend from bookings table
    const getBookedSeat = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/bookings/get-booked-seat', { busid: params.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());
            if (response.data.success) {
                setBookedSeat(response.data.data.map(seat => seat.seatnumber));
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        getBookedSeat();
    }, []);

    const selectOrUnselect = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
        }
        else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    }

    return (
        <div className='mx-5'>
            <div className="bus-container">
                <Row gutter={[10, 10]} className="mt-3">
                    {Array.from(Array(capacity).keys()).map((seat) => {
                        let seatClass = ""
                        if (selectedSeats.includes(seat + 1)) {
                            seatClass = "selectedseat";
                        }
                        else if (BookedSeat.includes(seat + 1)) {
                            seatClass = "booked-seat";
                        }
                        return (
                            <Col span={6}>
                                <div className={`seat ${seatClass}`} onClick={() => {
                                    selectOrUnselect(seat + 1);
                                }}>
                                    {seat + 1}
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        </div>
    )
}

export default SeatSelection;
