import React, { useEffect, useState } from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Header from "./Header";
import SideNav from "./SideNav";
import Home from "./Home";
import Users from "./Users/Users";
import CreateUsers from "./Users/CreateUser";
import EditUser from "./Users/EditUser";
import Test from './Users/test'

function App() {
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

    return (
        <div>
            <BrowserRouter>
                <Header power={power} />
                <SideNav power={power} />
                <Route path="/home" exact component={Home} />
                <Route path="index.html" exact component={Home} />
                <Route path="/users" exact component={Users} />
                <Route path="/users/create" exact component={CreateUsers} />
                <Route path="/users/edit" exact component={EditUser} />
                <Route path="/test" exact component={Test} />
            </BrowserRouter>
        </div>
    )
}

export default App;