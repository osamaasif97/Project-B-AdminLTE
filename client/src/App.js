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
import Permissions from './components/permission/Permissions'
import createPermissions from './components/permission/createPermission';

function App() {
  const token = sessionStorage.getItem('token')
  const [power, setPower] = useState()
  const [user, setUser] = useState()

  const [dashboardView, setDashboardView] = useState(false)

  const [viewUser, setViewUser] = useState(false)
  const [createUser, setCreateUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [DeleteUser, setDeleteUser] = useState(false)
  const [dragUser, setDragUser] = useState(false)

  const [viewAdmin, setViewAdmin] = useState(false)
  const [editAdmin, setEditAdmin] = useState(false)

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
      setUser(result.data)
      setPower(result.data.power);
    }
  }

  async function getPermission() {
    if (power) {
      const result = await fetch("http://localhost:4000/admins/getPermissions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          power
        })
      }).then((req) => req.json())
      if (result.status === 'ok') {
        const data = result.data[0]
        setDashboardView(data.dashboardView)
        setViewUser(data.viewUser)
        setCreateUser(data.createUser)
        setEditUser(data.editUser)
        setDeleteUser(data.DeleteUser)
        setDragUser(data.dragUser)
        setViewAdmin(data.viewAdmin)
        setEditAdmin(data.editAdmin)
      }
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    getPermission()
  }, [power])


  // console.log(dashboardView,
  //   viewUser,
  //   createUser,
  //   editUser,
  //   DeleteUser,
  //   dragUser,
  //   viewAdmin,
  //   editAdmin)

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
          <Header power={power} createUser={createUser} />
          <SideNav power={power}
            dashboardView={dashboardView}
            viewUser={viewUser}
            dragUser={dragUser}
            viewAdmin={viewAdmin}
            editAdmin={editAdmin}
          />
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="index.html" exact component={Home} />
          <Route path="/users" exact component={Users} />
          {dragUser && <Route path="/adminUsers" exact component={adminUsers} />}
          {/* {!drag ? <Route path="/users" exact component={Users} /> : <Redirect to='/adminUsers'><Route path="/adminUsers" exact component={adminUsers} /></Redirect>} */}
          {power === "Super Admin" ?
            <Route path="/permissions" exact component={Permissions} /> : <Redirect to='/home' />}
          {power !== "basic" ? <Route path="/admin" exact component={Admin} />
            : <Redirect to='/home' />}
          <Route path='/createPermission' exact component={createPermissions} />
          <Route path="/users/create" exact component={CreateUsers} />
          <Route path="/users/edit" exact component={EditUser} />
        </BrowserRouter>}
    </div>
  )
}

export default App;
