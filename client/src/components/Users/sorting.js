import React, { useState, useEffect, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DataTable from 'react-data-table-component'
import defaultPicture from '../../pics/defaultProfile.png'
import { Link } from 'react-router-dom';

const sorting = (data, props) => {
    const [showModal, setShowModal] = useState("close")
    const userData = useRef()

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <DataTable
                pagination
                columns={columns}
                data={data.data}
                selectableRows
                selectableRowsVisibleOnly
                highlightOnHover
                responsive
            />
        </div>
    )
}

export default sorting