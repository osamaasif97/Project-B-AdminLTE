import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import swal from 'sweetalert'
import './login.css'

function App() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState('password')
    const [icon, setIcon] = useState("nav-icon fas fa-eye")

    const handleToggle = () => {
        if (type === 'password') {
            setIcon("nav-icon fas fa-eye-slash")
            setType('text')

        }
        else {
            setIcon("nav-icon fas fa-eye")
            setType('password')
        }
    }

    async function loginUser(event) {
        event.preventDefault()
        const result = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const data = await result.json()
        console.log(data)

        if (data.user) {
            sessionStorage.setItem('token', data.token)
            swal({
                title: "",
                text: "Login Successful!",
                icon: "success",
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false,
                button: "Continue",
            }).then(() => { window.location.href = '/home' })
            // window.location.href = '/home'
        } else {
            swal({
                title: "Login Failed!",
                text: "Please check your email and password",
                icon: "error",
                button: "Continue",
            })
            // alert('Please check your email and password')
        }

        console.log(result)
    }

    return <div >
        <form onSubmit={loginUser} className='Logincontainer' >
            <h1 className='Header'>Login</h1>
            <b>Email ID</b>
            <input
                value={email} className="login"
                onChange={(e) => setEmail(e.target.value)}
                type="email" placeholder="Email ID"
            /><br />
            <b>Password</b>
            <input
                value={password} className="login"
                onChange={(e) => setPassword(e.target.value)}
                type={type} placeholder="Password"
            />
            <span className='eye' onClick={handleToggle}><i className={icon} /></span><br />
            <input className='button'
                type="submit" value="Login" /><br />
            <Link to='/register' className='links'>Register</Link>
        </form>
    </div >
}

export default App;
