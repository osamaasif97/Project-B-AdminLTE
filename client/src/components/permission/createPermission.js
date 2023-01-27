import React, { useState, useEffect } from 'react'
import './permissions.css'
import swal from 'sweetalert'

const Permissions = () => {
    const query = new URLSearchParams(window.location.search)
    const id = query.get('id')
    const name = query.get('name')

    const token = sessionStorage.getItem('token')
    const [permissionName, setPermissionName] = useState(name)
    const [permissionId, setPermissionId] = useState(id)

    const [dashboardView, setDashboardView] = useState(false)

    const [viewUser, setViewUser] = useState(false)
    const [createUser, setCreateUser] = useState(false)
    const [editUser, setEditUser] = useState(false)
    const [DeleteUser, setDeleteUser] = useState(false)
    const [dragUser, setDragUser] = useState(false)

    const [viewAdmin, setViewAdmin] = useState(false)
    const [editAdmin, setEditAdmin] = useState(false)
    const [DeleteAdmin, setDeleteAdmin] = useState(false)

    // async function getPermissions() {
    //     const result = await fetch("http://localhost:4000/admins/get-permission", {
    //         method: 'POST',
    //     }).then((req) => req.json())
    //     if (result.status === 'ok') {
    //         // setRow(result.data)
    //     }
    // }

    // useEffect(() => {
    //     getPermissions()
    // }, [])

    async function createPermission() {
        const result = await fetch("http://localhost:4000/admins/create-permission", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                permissionName,
                permissionId,
                dashboardView,
                viewUser,
                createUser,
                editUser,
                DeleteUser,
                dragUser,
                viewAdmin,
                editAdmin,
            })
        }).then((req) => req.json())
        if (result.status === 'ok') {
            swal({
                title: "",
                text: "Permission created Successfully!!",
                icon: "success",
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false,
                button: "Continue",
            }).then(() => {
                window.location.href = '/permissions'
            })
        }

    }

    useEffect(() => {
        if (editUser || DeleteUser) {
            setViewUser(true)
        }

        if (editAdmin || DeleteAdmin)
            setViewAdmin(true)
    }, [editUser || DeleteUser || editAdmin || DeleteAdmin])

    return (
        <div className="content-wrapper">
            <div style={{ paddingTop: '10px', margin: '40px' }}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                }
                }>
                    <label>
                        <span>Permission Name</span>
                        <input
                            type="text"
                            value={permissionName}
                            onChange={(e) => setPermissionName(e.target.value)}
                            placeholder="Permission Name"
                            className='createInput'
                        />
                        <br />
                        <span >Permission Details</span>
                        <textarea
                            type="text"
                            // value={permissionName}
                            // onChange={(e) => setPermissionName(e.target.value)}
                            placeholder="Details of the Permission"
                            className='createInput'
                            style={{ fontSize: '17px' }}
                        />
                        <br />
                        <br />
                        <div>
                            <span> Check All</span>
                            <input type="checkbox"
                                checked={dashboardView}
                                onChange={(e) => {

                                    setDashboardView(true)
                                    setViewUser(true)
                                    setCreateUser(true)
                                    setEditUser(true)
                                    setDeleteUser(true)
                                    setViewAdmin(true)
                                    setEditAdmin(true)
                                    setDeleteAdmin(true)
                                    if (dashboardView &&
                                        viewUser &&
                                        createUser &&
                                        editUser &&
                                        DeleteUser &&
                                        viewAdmin &&
                                        editAdmin) {
                                        setDashboardView(false)
                                        setViewUser(false)
                                        setCreateUser(false)
                                        setEditUser(false)
                                        setDeleteUser(false)
                                        setViewAdmin(false)
                                        setEditAdmin(false)
                                        setDeleteAdmin(false)
                                    }
                                }}
                                style={{ marginLeft: '10px', height: '15px', width: '15px' }}
                            />
                        </div>
                    </label>
                    <hr style={{
                        border: 0,
                        width: '510px',
                        height: '2px',
                        backgroundColor: 'black',
                        margin: '20px 0',
                        opacity: '20%'
                    }} />
                    <div style={{ marginLeft: '15px', textAlign: '-webkit-auto' }}>
                        <div>
                            <span className='moduleHeader'>Dashboard</span>
                            <span className='grids'>
                                <span>
                                    <span className='moduleOption'>View</span>
                                    <input
                                        type="checkbox"
                                        checked={dashboardView}
                                        onChange={(e) => setDashboardView(e.target.checked)}
                                    />
                                </span>
                            </span>
                        </div><br />

                        <div >
                            <span className='moduleHeader'>Users</span>
                            <span className='grids'>
                                <span>

                                    <span className='moduleOption' >View</span>
                                    <input
                                        type="checkbox"
                                        checked={viewUser}
                                        onChange={(e) => setViewUser(e.target.checked)}
                                    />
                                </span>
                                <span>
                                    <span className='moduleOption'>Edit</span>
                                    <input
                                        type="checkbox"
                                        checked={editUser}
                                        onChange={(e) => setEditUser(e.target.checked)}
                                    />
                                </span>
                                <span>
                                    <span className='moduleOption'>Delete</span>
                                    <input
                                        type="checkbox"
                                        checked={DeleteUser}
                                        onChange={(e) => setDeleteUser(e.target.checked)}
                                    />
                                </span>
                                <span>
                                    <span className='moduleOption'>Create</span>
                                    <input
                                        type="checkbox"
                                        checked={createUser}
                                        onChange={(e) => setCreateUser(e.target.checked)}
                                    />
                                </span>
                            </span>
                        </div> <br />

                        <div>
                            <span className='moduleHeader' >Admin</span>
                            <span className='grids'>

                                <span>
                                    <span className='moduleOption' >View</span>
                                    <input
                                        type="checkbox"
                                        checked={viewAdmin}
                                        onChange={(e) => setViewAdmin(e.target.checked)}
                                    />
                                </span>
                                <span>
                                    <span className='moduleOption'>Edit</span>
                                    <input
                                        type="checkbox"
                                        checked={editAdmin}
                                        onChange={(e) => setEditAdmin(e.target.checked)}
                                    />
                                </span>
                                <span>
                                    <span className='moduleOption'>Delete</span>
                                    <input
                                        type="checkbox"
                                        checked={DeleteAdmin}
                                        onChange={(e) => setDeleteAdmin(e.target.checked)}
                                    />
                                </span>
                            </span>
                        </div>
                    </div>

                    <hr style={{
                        border: 0,
                        width: '510px',
                        height: '2px',
                        backgroundColor: 'black',
                        margin: '20px 0',
                        opacity: '20%'
                    }} />
                    <div >
                        <button className='permissionButton' onClick={() => createPermission()}> Create</button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default Permissions