import React, { useState, useRef } from 'react'
import defaultPicture from '../../pics/defaultProfile.png'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export const CropImage = ({ images, showModal, setShowModal, setFinalImage }) => {
    const [src, selectFile] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [cropperDisplay, setCropperDisplay] = useState()

    const handleFileChange = e => {
        setCropperDisplay()
        setFileName(e.target.files[0].name);
        selectFile(URL.createObjectURL(e.target.files[0]))
        setImage(e.target.files[0])
    }

    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({ aspect: 1 / 1 })
    const [croppedImageUrl, setCroppedImageUrl] = useState()
    const imageRef = useRef(null);

    const onImageLoaded = image => {
        imageRef.current = image;
    };

    const onCropComplete = (crop) => {
        makeClientCrop(crop);
    }

    const makeClientCrop = async (crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const image = imageRef.current;
            const croppedImageUrl = await getCroppedImg(image, crop, fileName);
            setCroppedImageUrl(croppedImageUrl);
        }
    }

    function getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.target.naturalWidth / image.target.width;
        const scaleY = image.target.naturalHeight / image.target.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            image.target,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = src;
                window.URL.revokeObjectURL(croppedImageUrl)
                setCroppedImageUrl(window.URL.createObjectURL(blob))
            }, "image/jpeg")
        });
    }
    return <>{showModal ? <div className='backgroundBlur'>
        < div className="container" style={{ height: '390px' }}>
            <i fixedWidth className='fa fa-times closemodalbutton'
                onClick={() => setShowModal("close")} />
            <div style={{ textAlign: 'center' }}>
                {croppedImageUrl ?
                    <img src={croppedImageUrl} alt="cropped" className="createdisplayImage" />
                    :
                    <img src={images === "Default" ? defaultPicture : images} alt="" className="createdisplayImage" />
                }
                <label>
                    <input type='file' style={{
                        display: 'none'
                    }}
                        onChange={handleFileChange}
                        accept='image/*'
                    />
                    <i className="nav-icon fas fa-camera"
                        style={{ fontSize: '30px' }}
                    />
                </label>

                {src && <div className='Cropper' style={{ display: cropperDisplay }}>
                    <ReactCrop
                        circularCrop={1}
                        aspect={1 / 1}
                        src={src}
                        crop={crop}
                        onChange={newCrop => setCrop(newCrop)}
                        onComplete={onCropComplete}
                    >
                        <img src={src} alt="Cropper" style={{ maxHeight: "200px" }} onLoad={onImageLoaded} />
                    </ReactCrop><br />
                    <button className='btn btn-danger' onClick={() => {
                        setFinalImage(croppedImageUrl)
                        setShowModal("close")
                    }} >Save Image</button>
                </div>
                }
            </div>
        </div >

    </div> : null}</>

}