import React from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../AdminLTELogo.png'
function SideNav({ power, dashboardView, viewUser, dragUser, viewAdmin, editAdmin }) {
    const location = useLocation();
    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to="/" className="brand-link">
                    <img src={logo} alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">AdminLTE 3</span>
                </Link>
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
                            {/* <li className="nav-item menu-open">
                                <a href="#" className="nav-link active">
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>
                                        Dashboard
                                        <i className="right fas fa-angle-left" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href="./index.html" className="nav-link active">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Dashboard v1</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="./index2.html" className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Dashboard v2</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="./index3.html" className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Dashboard v3</p>
                                        </a>
                                    </li>
                                </ul>
                            </li> */}
                            {dashboardView && <li className="nav-item" >
                                <Link to="/home"
                                    className={`nav-link ${location.pathname === "/home" ? "active" : null}`}
                                >
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>Dashboard</p>
                                </Link>
                            </li>}
                            {power === "Super Admin" &&
                                <li className="nav-item">
                                    <Link to="/users" className={`nav-link ${location.pathname === "/users" ? "active" : null}`}>
                                        <i className="nav-icon fas fa-users" />
                                        <p>
                                            Users
                                        </p>
                                    </Link>
                                </li>}

                            {viewUser && power !== "Super Admin" &&
                                < li className="nav-item">
                                    <Link to="/users" className={`nav-link ${location.pathname === "/users" ? "active" : null}`}>
                                        <i className="nav-icon fas fa-users" />
                                        <p>
                                            Users
                                        </p>
                                    </Link>
                                </li>}

                            {power === "Super Admin" && <li className="nav-item">
                                <Link to="/adminUsers" className={`nav-link ${location.pathname === "/adminUsers" ? "active" : null}`}>
                                    <i className="nav-icon bx bxs-wrench" />
                                    <p>
                                        Testing
                                    </p>
                                </Link>
                            </li>}
                            {/* {dragUser && power !== "Super Admin" &&
                                <li className="nav-item">
                                    <Link to="/adminUsers" className={`nav-link ${location.pathname === "/adminUsers" ? "active" : null}`}>
                                        <i className="nav-icon fas fa-users" />
                                        <p>
                                            Users
                                        </p>
                                    </Link>
                                </li>} */}

                            {viewAdmin && <li className="nav-item">
                                <Link to="/admin" className={`nav-link ${location.pathname === "/admin" ? "active" : null}`}>
                                    <i className="nav-icon bx bxs-extension" />
                                    <p>
                                        Admin
                                    </p>
                                </Link>
                            </li>}
                            {editAdmin && <li className="nav-item">
                                <Link to="/permissions" className={`nav-link ${location.pathname === "/permissions" ? "active" : null}`}>
                                    <i className="nav-icon fas fa-lock" />
                                    <p>
                                        Permissions
                                    </p>
                                </Link>
                            </li>}
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside >

        </div >
    )
}

export default SideNav