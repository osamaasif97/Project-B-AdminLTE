import React, { useEffect, useRef, useState } from 'react'
import deleteUser from '../functions/deleteUser'
// import Loader from './Loader'
import cloudinary from "cloudinary/lib/cloudinary"

export const DeleteUserModal = ({ showModal, setShowModal, DATA, Users }) => {
    const [id, setId] = useState("")
    // // const [loader, setLoader] = useState(false)
    const imageData = useRef("")
    if (showModal === true) {
        if (DATA.image) {
            const image = DATA.image.substring(61, 81)
            imageData.current = image
            // setImageData(image)
        }
    }

    const deleteImage = async (e) => {
        cloudinary.config({
            cloud_name: "dahp7anty",
            api_key: "787471548259578",
            api_secret: "V1dfb234Y7SivDgebXADMSVxymo"
        })

        cloudinary.v2.uploader.destroy(imageData.current, function (error, result) {
            console.log(result, error)
        })
            .catch(_err => console.log("Something went wrong, please try again later."))
    }


    useEffect(() => {
        if (DATA) {
            setId(DATA.id)
        }
    }, [DATA])

    return <>{showModal ? <div className='backgroundBlur'>
        < div className="container">
            <i fixedWidth className='fa fa-times closemodalbutton'
                onClick={() => setShowModal("close")} /><br />
            <h3 className='Header'>Press confirm to delete User</h3>
            {/* {loader ? <div>
                <Loader />
            </div> : null} */}
            <button className="delete" onClick={(e) => {
                deleteUser(id, setShowModal, Users)
                deleteImage()
            }}>DELETE</button><br />
        </div >

    </div> : null}</>

}