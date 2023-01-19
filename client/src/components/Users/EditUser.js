import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'
// import Loader from '../Modals.js/Loader'
import getUser from '../functions/getUser'
import defaultPicture from '../../pics/defaultProfile.png'
import { CropImage } from '../Modal/CropImage'

const App = () => {

    const query = new URLSearchParams(window.location.search)
    const id = query.get('id')
    const [Data, setData] = useState()

    const [showModal, setShowModal] = useState()
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [number, setNumber] = useState()
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState("")
    const [address, setAddress] = useState("")
    const [bio, setBio] = useState("")
    const [images, setImages] = useState([]);
    const [finalImage, setFinalImage] = useState()

    const [isHoveringEdit, setIsHoveringEdit] = useState(false);
    const [isHoveringDelete, setIsHoveringDelete] = useState(false);

    const handleMouseOverEdit = () => {
        setIsHoveringEdit(true);
    };
    const handleMouseOverDelete = () => {
        setIsHoveringDelete(true);
    };

    const handleMouseOut = () => {
        setIsHoveringEdit(false);
        setIsHoveringDelete(false);
    };

    useEffect(() => {
        async function User() {
            const user = await getUser(id)
            setData(user[0])
        }
        User()
    }, [])

    useEffect(() => {
        if (Data) {
            setFirstName(Data.first_name)
            setLastName(Data.last_name)
            setEmail(Data.email)
            setAddress(Data.address)
            setStatus(Data.status)
            setBio(Data.bio)
            setImages(Data.profile_pic)
        }
    }, [Data])

    async function createContact(url) {
        // setLoader(false)
        const result = await fetch('http://localhost:4000/users/edit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                first_name,
                last_name,
                number,
                email,
                address,
                status,
                profile_pic: url ? url : "Default",
                bio
            }),
        }).then((res) => res.json())
        if (result.status === 'ok') {
            swal({
                title: "",
                text: "Contact created Successfully!!",
                icon: "success",
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false,
                button: "Continue",
            }).then(() => {
                window.location.href = '/users'
            })

        }
        if (result.status === 'error') {
            swal({
                title: "Error",
                text: result.error,
                icon: "warning",
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false,
                button: "Continue",
            })
            // alert(result.error)
        }
    }

    async function uploadPic() {
        // setLoader(true)
        const blob = await fetch(finalImage).then(response => response.blob());
        const data = new FormData()
        data.append("file", blob)
        data.append("upload_preset", "contact_login")
        data.append("cloud_name", "dahp7anty")
        fetch("https://api.cloudinary.com/v1_1/dahp7anty/image/upload", {
            method: "post",
            body: data
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                // setUrl(data.url)
                createContact(data.url)
            })
            .catch(err => console.log(err))
    }

    return <div className="content-wrapper" style={{ padding: '10px' }}>

        <div className='TopHeader'>
            <h1>Welcome</h1>
            <h2 className="Header" >Edit User Details</h2>
        </div>
        {Data ?
            <form onSubmit={(e) => {
                e.preventDefault()
                uploadPic()
            }} className="CreationForm">

                <div className='inputGroup'>
                    <div>
                        <div className='starter'>First Name</div>
                        <input
                            value={first_name} className="createInput"
                            onChange={(e) => setFirstName(e.target.value)}
                            type="text" placeholder="Elon"
                        />
                    </div>

                    <div>
                        <div className='starter'>Last Name</div>
                        <input
                            value={last_name} className="createInput"
                            onChange={(e) => setLastName(e.target.value)}
                            type="text" placeholder="Musk"
                        />
                    </div>
                </div>

                <div className='Picture'>
                    {finalImage ?
                        <img src={finalImage} alt="cropped" className="createdisplayImage" />
                        :
                        <img src={images === "Default" ? defaultPicture : images} alt="" className="createdisplayImage" />

                    }

                    <i className="nav-icon fas fa-edit"
                        onMouseOver={() => {
                            handleMouseOverEdit()
                        }} onMouseOut={handleMouseOut}
                        onClick={() => setShowModal("EditPic")}
                    />
                    {images !== "Default" || finalImage ? <i className="nav-icon fas fa-trash" onClick={(e) => {
                        e.preventDefault()
                        setImages("Default")
                        setFinalImage()
                        handleMouseOut()
                        // setCropperDisplay("none")
                    }} style={{ marginLeft: '10px' }}
                        onMouseOver={() => {
                            handleMouseOverDelete()
                        }} onMouseOut={handleMouseOut}
                    /> : null}
                    <span className='HOVER'>
                        {isHoveringEdit ? "Edit Pic" : null}
                        {isHoveringDelete ? "Remove Pic" : null}
                    </span>

                    <CropImage
                        images={images}
                        showModal={showModal === "EditPic"}
                        setShowModal={setShowModal}
                        setFinalImage={setFinalImage}
                    />

                </div>

                <div className='inputGroup'>
                    <div>
                        <div className='starter'>Number</div>
                        <input
                            value={number} className="createInput"
                            onChange={(e) => setNumber(e.target.value)}
                            type="text" placeholder="Number"
                        />
                    </div>

                    <div>
                        <div className='starter'>Email</div>
                        <input
                            value={email} className="createInput"
                            onChange={(e) => setEmail(e.target.value)}
                            type="text" placeholder="Email ID"
                        />
                    </div>

                </div>

                <div className='Status' >
                    <span className='starter'>Status</span>
                    <label className="switch" style={{ marginLeft: '20px', bottom: '3px' }} >
                        <input type="checkbox" defaultChecked={Data.status === "Active" ? true : false}
                            onClick={(e) => {
                                if (e.target.checked === true) {
                                    setStatus("Active")
                                } else {
                                    setStatus("Inactive")
                                }
                            }}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div className='Address'>
                    <div className='starter'>Address</div>
                    <textarea
                        value={address} className="AddressInput"
                        onChange={(e) => setAddress(e.target.value)}
                        type="text" placeholder="Address: Optional"
                        style={{ height: '70px' }}
                    />
                </div>

                <div className='Address'>
                    <span className='starter'>Bio</span><br />
                    <textarea
                        value={bio}
                        className="AddressInput"
                        onChange={(e) => setBio(e.target.value)}
                        type="text" placeholder="Bio: Optional"
                        style={{ height: '100px' }}
                    />
                </div>

                <hr />
                <div>
                    {/* {loader ? <span style={{ position: 'relative', left: '290px', top: '105px' }}>
                        <Loader />
                    </span> : null} */}
                    <div style={{ textAlign: 'center' }}>
                        <input className="Createbutton"
                            type="submit" value="Update Contact" />
                    </div>
                </div>
            </form>
            : null}
    </div >
}

export default App;