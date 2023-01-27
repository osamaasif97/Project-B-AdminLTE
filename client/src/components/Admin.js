import React, { useEffect, useState, } from 'react'
import AdminTable from './AdminTable';

const Admin = () => {
    const token = sessionStorage.getItem('token')
    const [power, setPower] = useState()
    const [data, setData] = useState()

    async function getUsers() {
        const result = await fetch(`http://localhost:4000/admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).then(data => data.json())
        setData(result.data)
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
        setPower(result.data.power)
    }

    useEffect(() => {
        getUsers()
        getUser()
    }, [])

    if (data) {
        return (
            <div>
                <AdminTable Dataa={data} token={token} power={power} />
            </div>
        )
    }
}

export default Admin