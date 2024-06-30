import { message,Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import BusForm from '../../components/BusForm';
import PageTitle from '../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  // const deletebus = async (id) => {
  //   try {
  //     dispatch(ShowLoading());
  //     const response = await axios.post('/api/buses/delete-bus', { busid: id }, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });
  //     dispatch(HideLoading());
  //     if (response.data.success) {
  //       message.success(response.data.message);
  //       getBuses();
  //     }
  //     else {
  //       message.error(response.data.message);
  //     }
  //   } catch (error) {
  //     dispatch(HideLoading());
  //     message.error(error.message);
  //   }
  // };
  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/buses/get-all-buses',{}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      dispatch(HideLoading());
      
      if (response.data.success) {
        message.success(response.data.message);
        setBuses(response.data.data);
      }
      else{
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns=[
    {
      title: "Bus name",
      dataIndex: "busnumber",
    },{
      title: "Bus number",
      dataIndex: "busid",
    },
    {
      title: "Origin",
      dataIndex: "origin",
    },
    {
      title: "Destination",
      dataIndex: "destination",
    },
    {
      title: "Date",
      dataIndex: "dates",
      render : (dates) => moment(dates).format('DD-MM-YYYY'),
    },
    {
      title: "Departure time",
      dataIndex: "departuretime",
    },
    {
      title: "Arrival time",
      dataIndex: "arrivaltime",
    },
    
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className='d-flex gap-3'>
          < i class="ri-pencil-fill" onClick={()=>{
            setSelectedBus(record);
            setShowBusForm(true);
          }}></i>
          {/* <i class="ri-delete-bin-fill" onClick={()=>{
            deletebus(record.busid);
            
          }}></i> */}
        </div>
      ),
    }
  ]
      
  useEffect(() => {
    getBuses();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="Buses"/>
        <button className="secondary-btn" onClick={()=>setShowBusForm(true)}>Add Bus</button>
      </div>
      <Table dataSource={buses} columns={columns} rowKey="busid" pagination={{ position: ['bottomCenter'] }}/>
      {showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type={selectedBus?"edit":"add"} selectedBus={selectedBus} getData={getBuses} setSelectedBus={setSelectedBus}></BusForm>}

    </div>
  )
}

export default AdminBuses;