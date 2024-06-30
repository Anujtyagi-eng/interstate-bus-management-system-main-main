import { Button, message, Modal, Space, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import PageTitle from '../components/PageTitle';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { useReactToPrint } from 'react-to-print';


function Bookings() {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const dispatch = useDispatch();
    const [bookings, setBookings] = useState([]);
    
    const getBookings = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/bookings/get-bookings-by-user-id', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());
            if (response.data.success) {
                setBookings(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: 'Bus Number',
            dataIndex: 'busid',
            key: 'busid',
        },
        {
            title: 'Bus Name',
            dataIndex: 'busnumber',
            key: 'busnumber',
        },
        {
            title: 'Source',
            dataIndex: 'origin',
            key: 'origin',
        },
        {
            title: 'Destination',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            // use moment to format date
            title: ' Journey Date',
            dataIndex: 'dates',
            render: (dates) => moment(dates).format('DD-MM-YYYY'),
        },

        {
            title: 'Departure Time',
            dataIndex: 'departuretime',
            key: 'departuretime',
        },
        {
            title: 'Seat Number',
            dataIndex: 'seatnumber',
            key: 'seatnumber',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <h1 className="text-md underline" style={{color: "rgb(13,255,57)"}} onClick={() => {
                        setSelectedBooking(record);
                        setShowPrintModal(true);
                    }}>Print Ticket</h1>
                </div>
            )
            
        },

    ];


    useEffect(() => {
        getBookings();
    }, []);

    const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


    return (
        <div>
            <PageTitle title="Bookings" />
            <Table dataSource={bookings} columns={columns} pagination={{ position: ['bottomCenter'] }}/>
            {showPrintModal && <Modal title="Print Ticket" onCancel={() => {
                setShowPrintModal(false);
                setSelectedBooking(null);
            }} 
            visible={showPrintModal}
            okText="Print"
            onOk={handlePrint}

            >
                <div className="d-flex flex-column p-5" ref={componentRef}>
                    <h1 className="text-xl">{selectedBooking.busnumber}</h1>
                    <h1 className="text-lg">{selectedBooking.origin}-{selectedBooking.destination}</h1>
                    <hr />
                    <h1 className="text-md ">Journey Date: {moment(selectedBooking.dates).format('DD-MM-YYYY')}</h1>
                    
                    <h1 className="text-md">Departure Time: {selectedBooking.departuretime}</h1>
                
                    <h1 className="text-md ">Arrival Time: {selectedBooking.arrivaltime}</h1>
                    <hr />
                    <h1 className="text-md ">Seat Number: {selectedBooking.seatnumber}</h1>
                    <hr />
                    <h1 className="text-md">Amount: {selectedBooking.amount} /-</h1>
                </div>
            </Modal>}
        </div>
    )
}

export default Bookings