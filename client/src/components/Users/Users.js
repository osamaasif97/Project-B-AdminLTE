import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component'
import allUsers from '../functions/getUsers'
import './users.css'
import defaultPicture from '../../pics/defaultProfile.png'
import { DeleteUserModal } from '../Modal/DeleteUser'
import { BulkDelete } from '../Modal/BulkDelete'
import activeStatus from '../functions/statusChanger/activeStatus'
import InactiveStatus from '../functions/statusChanger/inactiveStatus'

const Users = () => {

    const token = sessionStorage.getItem('token')
    const [power, setPower] = useState()
    async function getUser() {
        const result = await fetch(`http://localhost:4000/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).then(data => data.json())
        setPower(result.data.power);
    }

    useEffect(() => {
        getUser()
    }, [])


    const [data, setData] = useState()
    const [query, setQuery] = useState("")
    const [showModal, setShowModal] = useState("close")
    const [check, setCheck] = useState(false)
    const userData = useRef()

    async function Users() {
        const users = await allUsers()
        setData(users)
    }
    useEffect(() => {
        if (check === true) {
            Users().then(() => setCheck(false))
        }
    }, [check === true])

    useEffect(() => {
        Users()
    }, [])

    const handleCheck = (e) => {
        userData.current = e.selectedRows
    }

    const activate = (e) => {
        // e.preventDefault()
        activeStatus(userData.current, setCheck)
    }

    const Deactivate = (e) => {
        // e.preventDefault()
        InactiveStatus(userData.current, setCheck)
    }

    const columns = [
        {
            slector: row => row.profile_pic,
            button: true,
            compact: true,
            width: '80px',
            cell: (row) => <div>
                <img src={row.profile_pic === "Default" ? defaultPicture : row.profile_pic} alt="" style={{
                    width: '40px', height: '40px', borderRadius: '50%'
                }} />
            </div>
        },
        {
            name: 'First Name',
            selector: row => row.first_name,
            sortable: true
        },
        {
            name: 'Last name',
            selector: row => row.last_name,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true
        },
        {
            name: "Action",
            selector: row => row.action,
            button: true,
            omit: power === "super-admin" ? false : true,
            cell: (row) => <div>
                <Link to={"/users/edit?id=" + `${row.id}`} className="modals" style={{
                    color: "limegreen",
                    paddingLeft: "5px",
                    paddingRight: "10px",
                    fontSize: '17px'
                }}
                >
                    <i className="bx bx-edit" />
                </Link>
                <span onClick={() => {
                    userData.current = row
                    setShowModal("delete")
                }
                } className="modals" style={{
                    color: "red",
                    paddingLeft: "5px",
                    paddingRight: "10px",
                    fontSize: '17px',
                    cursor: 'pointer'
                }}
                >
                    <i className="nav-icon fas fa-trash" />
                </span>
            </div>

        },

    ]
    const Data = data
    // console.log(data); 

    return (
        <div>
            {/* <SideNav /> */}
            <section className="content-wrapper" style={{ padding: '10px' }}>
                {power === "super-admin" && <span>
                    <button className="deleteContact"
                        onClick={() => setShowModal("Bulk-delete")}
                    >Delete</button>
                    <button className="activate"
                        onClick={activate}
                    >Activate</button>
                    <button className="activate" style={{ backgroundColor: "#ccc" }}
                        onClick={Deactivate}
                    >
                        Deactivate</button>
                </span>}
                <input value={query} placeholder="Filter"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }
                    } className="filter" />
                {Data ?
                    <DataTable
                        pagination
                        columns={columns}
                        data={Data.filter(dat => dat.first_name.toLowerCase().includes(query) ||
                            dat.last_name.toLowerCase().includes(query) ||
                            dat.email.toLowerCase().includes(query) ||
                            dat.address.toLowerCase().includes(query)
                        )}
                        selectableRows={power === "super-admin" ? true : false}
                        selectableRowsVisibleOnly
                        onSelectedRowsChange={handleCheck}
                        highlightOnHover
                        responsive
                    >
                    </DataTable>
                    : null}
                <DeleteUserModal showModal={showModal === "delete"} setShowModal={setShowModal} DATA={userData.current}
                    setCheck={setCheck} />
                <BulkDelete showModal={showModal === "Bulk-delete"} setShowModal={setShowModal} DATA={userData.current}
                    setCheck={setCheck} />
            </section>
        </div>

    )
}

export default Users