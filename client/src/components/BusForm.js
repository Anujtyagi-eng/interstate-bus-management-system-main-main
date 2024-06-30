import React from 'react';
import { Modal, Form, Row, Col, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import moment from 'moment';

function BusForm({ showBusForm, setShowBusForm, type = 'add', getData, selectedBus,setSelectedBus }) {
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response = null;
            if (type === 'add') {
                response = await axios.post('/api/buses/add-bus', values, {

                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            else{
                response = await axios.post('/api/buses/update-bus', {
                    ...values,
                    _id: selectedBus._id,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            if (response.data.success) {
                message.success(response.data.message);
                setShowBusForm(false);
            }
            else {
                message.error(response.data.message);
            }
            getData();
            setShowBusForm(false);
            setSelectedBus(null);
            dispatch(HideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(HideLoading());
        }
    };
    return (
        <div>
            <Modal width={800} title = {type === "add" ? "Add Bus" : "Update Bus"} visible={showBusForm} onCancel={() => {setShowBusForm(false);setSelectedBus(null)}} footer={false}>
            <Form layout='vertical' onFinish={onFinish} initialValues={{...selectedBus, dates: selectedBus ? moment(selectedBus.dates).format('YYYY-MM-DD') : null}}>
                    <Row gutter={[10, 10]}>
                        <Col lg={24}>
                            <Form.Item label="Bus Name" name="busnumber">
                                <input type="text" />
                            </Form.Item>
                        </Col>
                        <Col lg={12}>
                            <Form.Item label="Bus Number" name="busid">
                                <input type="text" />
                            </Form.Item>
                        </Col>
                        <Col lg={12}>
                            <Form.Item label="Capacity" name="capacity">
                                <input type="int" />
                            </Form.Item>
                        </Col>
                        <Col lg={12}>
                            <Form.Item label="Origin" name="origin">
                                <input type="text" />
                            </Form.Item>
                        </Col>
                        <Col lg={12}>
                            <Form.Item label="Destination" name="destination">
                                <input type="text" />
                            </Form.Item>
                        </Col>

                        <Col lg={6}>
                            <Form.Item label="Journey Date" name="dates">
                                <input type="date" />
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <Form.Item label="Departure" name="departuretime">
                                <input type="time" />
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <Form.Item label="Arrival" name="arrivaltime">
                                <input type="time" />
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <Form.Item label="Fare" name="amount">
                                <input type="decimal" />
                            </Form.Item>
                        </Col>
                        <Col lg={12}>
                            <Form.Item label="Status" name="status">
                                <select>
                                    <option value="yet to start">yet to start</option>
                                    <option value="running">running</option>
                                    <option value="completed">completed</option>
                                </select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end">
                        <button className="secondary-btn" type='submit'>Add Bus</button>
                    </div>
                </Form>

            </Modal>
        </div>
    )
}

export default BusForm