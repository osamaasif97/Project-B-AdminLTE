import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './permissions.css'
import DataTable from 'react-data-table-component'
import swal from 'sweetalert'

const Permissions = () => {
    const token = sessionStorage.getItem('token')
    const [power, setPower] = useState()
    const [newPermission, setNewPermission] = useState(false)
    const [permissionName, setPermissionName] = useState("")
    const [permissionId, setPermissionId] = useState("")
    const [create, setCreate] = useState(false)
    const [edit, setEdit] = useState(false)
    const [Delete, setDelete] = useState(false)
    const [drag, setDrag] = useState(false)
    const [row, setRow] = useState()
    const [newRow, setNewRow] = useState()
    const [isChecked, setIsChecked] = useState(false);

    async function getPermissions() {
        const result = await fetch("http://localhost:4000/admins/get-permissions", {
            method: 'POST',
        }).then((req) => req.json())
        if (result.status === 'ok') {
            setRow(result.data)
            setPermissionId(result.data.length + 1)
        }
    }

    async function getUser() {
        const result = await fetch(`http://localhost:4000/admins/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).then(data => data.json())
        if (result.message === 'ok') {
            setPower(result.data.power)
        }
    }

    async function updateRow(index, name, check) {
        row[index][name] = check
        const rowUpdate = row[index]
        const result = await fetch('http://localhost:4000/admins/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                rowUpdate
            })
        }).then(data => data.json())
    }
    async function createRow() {
        if (newRow !== undefined) {
            await fetch('http://localhost:4000/admins/create-permission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newRow
                })
            }).then(data => data.json())
                .then(() => getPermissions())
        }
    }
    async function deleteRow(id) {
        await fetch('http://localhost:4000/admins/deleteRow', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                id
            })
        }).then(data => data.json())
        //         .then(() => getPermissions())
    }

    useEffect(() => {
        getPermissions()
    }, [])
    useEffect(() => {
        getUser()
    }, [])

    const handleCheckboxChange = (index) => (event) => {
        const name = event.target.name;
        const check = event.target.checked
        if (row[index].permissionName !== "Super Admin")
            updateRow(index, name, check)
    }

    const column = [
        {
            name: 'Permission Name',
            selector: row => row.permissionName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Dashboard View',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="dashboardView"
                    defaultChecked={row.dashboardView}
                    onClick={handleCheckboxChange(index)}
                />
            </div>
        },
        {
            name: 'View User',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="viewUser"
                    defaultChecked={row.viewUser}
                    onClick={handleCheckboxChange(index)}
                />
            </div>
        },
        {
            name: 'Create User',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="createUser"
                    defaultChecked={row.createUser}
                    onClick={handleCheckboxChange(index)}
                />
            </div>
        },
        {
            name: 'Edit User',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="editUser"
                    defaultChecked={row.editUser}
                    onClick={handleCheckboxChange(index)}
                />
            </div>
        },
        {
            name: 'Delete User',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="DeleteUser"
                    defaultChecked={row.DeleteUser}
                    onClick={handleCheckboxChange(index)}
                />
            </div>
        },
        {
            name: 'View Admin',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="viewAdmin"
                    defaultChecked={row.viewAdmin}
                    onClick={(handleCheckboxChange(index))}
                />
            </div>
        },
        {
            name: 'Edit Admin',
            sortable: true,
            // button: true,
            cell: (row, index) => <div>
                <input type="checkbox"
                    name="editAdmin"
                    defaultChecked={row.editAdmin}
                    onClick={(handleCheckboxChange(index))}
                />
            </div>
        },
        {
            name: 'Remove',
            button: true,
            cell: (Row) => <div style={{ textAlign: 'center' }}>
                {Row.permissionId === 1 || Row.permissionId === 2 ?
                    null : <i className="nav-icon fas fa-trash " style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setRow(row.filter(row => row.permissionId !== Row.permissionId))
                            deleteRow(Row._id)
                        }} />
                }
            </div>
        },

    ]
    useEffect(() => {
        if (newPermission) {
            // setRow([...row, {
            //     permissionName,
            //     permissionId,
            //     create,
            //     edit,
            //     Delete,
            //     drag
            // }])
            setNewRow(
                {
                    permissionName,
                    permissionId,
                    create,
                    edit,
                    Delete,
                    drag
                })
        }
        createRow()
        setNewPermission(false)
    }, [newPermission])

    return (
        <div className="content-wrapper">
            <div style={{ paddingTop: '10px', marginLeft: '10px' }}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    // if (permissionName !== "") {
                    //     setNewPermission(true)
                    //     setPermissionId(row.length + 1)
                    // }

                }
                }>
                    <input placeholder="Create Permission"
                        value={permissionName}
                        onChange={(e) => setPermissionName(e.target.value)}
                        className="filter" />
                    <Link to={`/createPermission?name=${permissionName}&id=${permissionId}`} style={{ color: 'black' }}>
                        <i className="nav-icon fas fa-plus" style={{ cursor: 'pointer' }} />
                    </Link>

                </form>

                <DataTable
                    pagination
                    columns={column}
                    data={row}
                    highlightOnHover
                    responsive
                />
            </div>
        </div>
    )
}

export default Permissions