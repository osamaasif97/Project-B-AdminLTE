import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import swal from 'sweetalert'
import './login.css'

function App() {
    const [name, setName] = useState('')
    const history = useHistory()
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

    async function registerUser(event) {
        event.preventDefault()
        const result = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        const data = await result.json()
        console.log(data.message)
        if (data.status === 'ok') {
            swal({
                title: "",
                text: data.message,
                icon: "success",
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false,
                button: "Continue",
            }).then(() => { history.push('/login') })
        }
        else if (data.status === 'error') {
            swal({
                title: "Error",
                text: data.error,
                icon: "error",
                button: "Continue",
            })
            // alert(data.error)
        }
    }

    return <div >
        <form onSubmit={registerUser} className='Logincontainer' >
            <h1 className='Header'>Register</h1>
            <b>Name</b>
            <input
                value={name} className="login"
                onChange={(e) => setName(e.target.value)}
                type="text" placeholder="Name"
            /><br />
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
                type="submit" value="Register" /><br />
            <Link to='/login' className='links'>Login</Link>
        </form> <br />
    </div>
}

export default App;
