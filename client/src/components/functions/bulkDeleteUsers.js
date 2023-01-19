import swal from 'sweetalert'

async function BulkDelete(Data, setShowModal, setCheck) {
    const result = await fetch(`http://localhost:4000/users/bulkdelete`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({
            DATA: Data
        })
    }).then((req) => req.json())
    if (result.status === 'ok') {
        swal({
            title: "",
            text: result.message,
            icon: "success",
            timer: 2000,
            showCancelButton: false,
            showConfirmButton: false,
            button: "Continue",
        }).then(() => {
            setCheck(true)
            setShowModal("close")
            // setShowModal("close")
        })
    }
}

export default BulkDelete