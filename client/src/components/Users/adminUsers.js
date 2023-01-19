import React, { useEffect, useState } from 'react'
import allUsers from '../functions/getUsers'
// import './users.css'

import AdminUsersTable from './adminUsersTable';

const AdminUsers = () => {
    const [data, setData] = useState()

    async function Users() {
        const users = await allUsers()
        setData(users)
    }

    useEffect(() => {
        Users()
    }, [])

    if (data) {
        return (
            <div>
                <AdminUsersTable Dataa={data} Users={Users} />
            </div>
        )
    }
}

export default AdminUsers