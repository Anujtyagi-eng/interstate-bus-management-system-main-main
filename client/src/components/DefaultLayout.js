import React, { useState } from 'react';
import "../resources/layout.css";
import "../resources/global.css";
import{useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';


function DefaultLayout({ children }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {user} =useSelector(state=>state.users);
    const userMenu = [{
        name: 'Home',
        path: '/',
        icon: 'ri-home-8-fill'
    },
    {
        name: 'Bookings',
        path: '/bookings',
        icon: 'ri-file-list-fill'
    },
    {
        name: 'Logout',
        path: '/logout',
        icon: 'ri-logout-box-r-fill'
    }
]
    const adminMenu = [{
        name: 'Home',
        path: '/',
        icon: 'ri-home-8-fill'
    },
    {
        name: 'Buses',
        path: '/admin/buses',
        icon: 'ri-bus-2-fill'
    },
    {
        name: 'Users',
        path: '/admin/users',
        icon: 'ri-user-fill'
    },
    {
        name: 'Bookings',
        path: '/bookings',
        icon: 'ri-file-list-fill'
    },
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'ri-dashboard-fill'
    },
    {
        name: 'Logout',
        path: '/logout',
        icon: 'ri-logout-box-r-fill'
    }
]
    const menuToBeRendered = user?.isadmin ? adminMenu : userMenu;
    let activeRoute =window.location.pathname;
    if(window.location.pathname.includes("book-now")){
        activeRoute = '/';
    }
    
    return (

        <div className='layout-parent'>
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className='logo text-xl'>BookBus</h1>
                    <h1 className='role text-md'>{user?.username} <br/> Role : {user?.isadmin ? "Admin" : "User"}</h1>
                </div>
                <div className='d-flex flex-column gap-3 justify-content-start menu'>
                    {menuToBeRendered.map((menu, index) => {
                        return <div className={`${activeRoute===menu.path && 'active-menuItem'} menuItem`}>
                            <i className={menu.icon}></i>
                            {!collapsed && <span onClick={()=>{
                                if(menu.path==='/logout'){
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }else{
                                    navigate(menu.path);
                                }}
                            }>{menu.name}</span>}
                        </div>
                    }
                    )};
                </div>

            </div>
            <div className="body">
                <div className="header">
                    {collapsed ?(<i class="ri-menu-2-fill" 
                    onClick={()=>setCollapsed(!collapsed)}
                    >
                    </i>):(<i class="ri-close-circle-fill" 
                    onClick={()=>setCollapsed(!collapsed)}
                    ></i>)}
                </div>
                <div className="content">
                    {children}
                </div>
            </div>

        </div>
    )
}

export default DefaultLayout;