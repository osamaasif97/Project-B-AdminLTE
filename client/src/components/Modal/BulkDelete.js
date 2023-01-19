import React from 'react'
import BulkDeleteUsers from '../functions/bulkDeleteUsers'
// import Loader from './Loader'

export const BulkDelete = ({ showModal, setShowModal, DATA, setCheck }) => {
    // const [loader, setLoader] = useState(false)
    if (!DATA) {
        setShowModal("close")
    }
    return <>{DATA ? showModal ? <div className='backgroundBlur'>
        < div className="container">
            <i fixedWidth className='fa fa-times closemodalbutton'
                onClick={() => setShowModal("close")} />
            <h3 className='Header'>Press confirm to delete the  selected {DATA.length}
                {DATA.length === 1 ? " User" : " Users"}</h3>
            {/* {loader ? <div>
                <Loader />
            </div> : null} */}
            <button className="delete"
                onClick={(e) => BulkDeleteUsers(DATA, setShowModal, setCheck)}
            >DELETE</button><br />
        </div >

    </div> : null : null}</>

}