import { message, Row, Col } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import Bus from '../components/Bus';

function Home() {

  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [filters = {}, setFilters] = useState({});
  const getBuses = async () => {
    const tempFilters = { ...filters };
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        tempFilters[key] = filters[key].toLowerCase();
      }
    });

    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/buses/get-all-buses', tempFilters, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(HideLoading());

      if (response.data.success) {
        setBuses(response.data.data);
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
    getBuses();
  }, []);
  return (
    <div>
      <div className='my-3 card px-2 py-3'>
        <Row gutter={10} align='center'>
          <Col lg={6}>
            <input type="text" placeholder='Origin' value={filters.origin}
              onChange={(e) => setFilters({ ...filters, origin: e.target.value })} />
          </Col>
          <Col lg={6}>
            <input type="text" placeholder='Destination' value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })} />
          </Col>
          <Col lg={6}>
            <input type="date" placeholder='Journey Date' value={filters.dates}
              onChange={(e) => setFilters({ ...filters, dates: e.target.value })} />
          </Col>
          <Col lg={6}>
            <div className="d-flex gap-2">
              <button className='primary-btn' onClick={() => getBuses()}>Search</button>
              <button className='secondary-btn' onClick={async() =>{
                setFilters(
                  { origin: '', destination: '', dates: '' }
                );
                await getBuses();
              } }>Clear</button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[15, 15]}>
          {buses
            .filter(bus => bus.status === 'yet to start')
            .map(bus => (
              <Col lg={12}>
                <Bus bus={bus} />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  )
}

export default Home;