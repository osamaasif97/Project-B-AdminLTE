import React, { useEffect, useState } from 'react'
import { Route, BrowserRouter, Redirect } from 'react-router-dom';

import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Users from "./components/Users/Users";
import CreateUsers from "./components/Users/CreateUser";
import EditUser from "./components/Users/EditUser";
import adminUsers from './components/Users/adminUsers'
import Register from './components/Register'
import Login from './components/Login'


function App() {
  const token = sessionStorage.getItem('token')
  const [power, setPower] = useState("")
  const [user, setUser] = useState()
  async function getUser() {
    if (token) {
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
      setUser(result.data._id)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div>
      {!user ? <BrowserRouter>
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={Login} />
        {/* <Route path="/home" exact component={MainHome} /> */}
      </BrowserRouter>
        :
        <BrowserRouter>
          <Header power={power} />
          <SideNav power={power} />
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="index.html" exact component={Home} />
          {power === "super-admin" || power === "basic" ?
            <Route path="/users" exact component={Users} /> : <Redirect to='/adminUsers' />}
          {power === "super-admin" || power === "admin" ?
            <Route path="/adminUsers" exact component={adminUsers} /> : <Redirect to='/users' />}
          {power !== "basic" ? <Route path="/admin" exact component={Admin} />
            : <Redirect to='/home' />}
          <Route path="/users/create" exact component={CreateUsers} />
          <Route path="/users/edit" exact component={EditUser} />
        </BrowserRouter>}
    </div>
  )
}

export default App;
