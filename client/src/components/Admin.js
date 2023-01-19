import React, { useEffect, useState, } from 'react'
import AdminTable from './AdminTable';

const Admin = () => {
    const token = sessionStorage.getItem('token')
    const [power, setPower] = useState()
    const [data, setData] = useState()

    async function getUser() {
        const result = await fetch(`http://localhost:4000/admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).then(data => data.json())
        setPower(result.data.power);
        setData(result.data)
    }

    useEffect(() => {
        getUser()
    }, [])

    if (data) {
        return (
            <div>
                <AdminTable Dataa={data} token={token} />
            </div>
        )
    }
}

export default Admin