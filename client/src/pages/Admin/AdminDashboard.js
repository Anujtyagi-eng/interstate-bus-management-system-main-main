import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import CountUp from 'react-countup';
import { Card, message, Space, Statistic } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const formatter = (value) => <CountUp end={value} separator="," />;

function AdminDashboard() {

    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [buses, setBuses] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [revenuebyMonth, setRevenuebyMonth] = useState([]);

    const getUsers = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/users/get-all-users', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());

            if (response.data.success) {
                // message.success(response.data.message);
                setUsers(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    const getBuses = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/buses/get-all-buses', {}, {
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
    const getRevenue = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/bookings/get-total-revenue', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());

            if (response.data.success) {
                // message.success(response.data.message);
                setRevenue(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }
    const getBookings = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/bookings/get-total-bookings', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());

            if (response.data.success) {
                // message.success(response.data.message);
                setJourneys(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const getRevenuebyMonth = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/bookings/get-revenue-for-12-months', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(HideLoading());

            if (response.data.success) {
                // message.success(response.data.message);
                setRevenuebyMonth(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }




    useEffect(() => {
        getUsers();
        getBuses();
        getRevenue();
        getBookings();
        getRevenuebyMonth();
    }, []);

    const revenueData = revenuebyMonth
        .map(entry => ({
            ...entry,
            total_revenue: parseFloat(entry.total_revenue)
        }))
        .filter(entry => !isNaN(entry.total_revenue))
        .map(entry => ({
            ...entry,
            month_name: entry.month_name.trim()
        }))
        .sort((a, b) => {
            const monthsOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return monthsOrder.indexOf(b.month_name) - monthsOrder.indexOf(a.month_name);
        });

    const chartData = {
        labels: revenueData.map(entry => entry.month_name),
        datasets: [
            {
                label: 'Revenue',
                data: revenueData.map(entry => entry.total_revenue),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            }
        ]
    };


    console.log(revenueData);

    return (
        <div>
            <div className="d-flex justify-content-between mb-4 mt-4">
                <PageTitle title="Dashboard" />
            </div>
            <div>
                <Space direction="horizontal" size={20}>
                    <Card style={{ backgroundColor: "rgb(201,255,193)", width: 170 }}>
                        <Space direction="horizontal">
                            <i className="ri-user-fill p-2"></i>
                            <Statistic title="Users" value={users.length} formatter={formatter} />
                        </Space>
                    </Card>
                    <Card style={{ backgroundColor: "rgb(142,138,255)", width: 250 }}>
                        <Space direction="horizontal">
                            <i class="ri-bus-2-fill"></i>
                            <Statistic title="Registered Buses" value={buses.length} formatter={formatter} />
                        </Space>
                    </Card>
                    <Card style={{ backgroundColor: "rgb(209,254,253)", width: 250 }}>
                        <Space direction="horizontal">
                            <i class="ri-emotion-laugh-line"></i>
                            <Statistic title="Happy journeys" value={journeys} formatter={formatter} />
                        </Space>
                    </Card>
                    <Card style={{ backgroundColor: "rgb(255,144,149)", width: 250 }}>
                        <Space direction="horizontal">
                            <i class="ri-money-rupee-circle-fill"></i>
                            <Statistic title="Revenue" value={revenue} formatter={formatter} />
                        </Space>
                    </Card>
                </Space>
            </div>
            <div style={{ width:"700px"}}>
    <Card>
        <Bar
            data={chartData}
            options={{
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Revenue',
                    },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90,
                                minRotation: 45
                            }
                        }
                    }
                },
            }}
        />
    </Card>
</div>

        </div>
    )
}

export default AdminDashboard;