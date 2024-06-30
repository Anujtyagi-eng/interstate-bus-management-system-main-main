import { message,Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import BusForm from '../../components/BusForm';
import PageTitle from '../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

function AdminUsers() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [users, setUsers] = useState([]);

 
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/get-all-users',{}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      dispatch(HideLoading());
      
      if (response.data.success) {
        message.success(response.data.message);
        setUsers(response.data.data);
      }
      else{
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const updateuserPermission = async (user, action) => {
    try {
      let payload={};
      if(action==='make-admin'){
        payload={...user,isadmin:true}
      };
      if(action==='remove-admin'){
        payload={...user,isadmin:false}
      };
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/update-user-permission',payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      dispatch(HideLoading());
    if(response.data.success){ 
      message.success(response.data.message);
      getUsers();
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
      title: "Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "isadmin",
      render: (text, record) => (
        <div>
          {record.isadmin ? "Admin" : "User"}
        </div>
      ),
      
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className='d-flex gap-3'>
          {record?.isadmin && <p className='underline' onClick={()=> updateuserPermission(record,'remove-admin') }>Remove Admin</p>}
          {!record?.isadmin && <p className='underline' onClick={()=> updateuserPermission(record,'make-admin') }>Make Admin</p>}
        </div>
      ),
    }
  ]
      
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="Users"/>
        {/* <button className="secondary-btn" onClick={()=>setShowBusForm(true)}>Users Permissions</button> */}
      </div>
      <Table columns={columns} dataSource={users} rowKey="_id" pagination={{ position: ['bottomCenter'] }}/>
    </div>
  )
}

export default AdminUsers;