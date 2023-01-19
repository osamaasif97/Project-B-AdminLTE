import swal from 'sweetalert'

async function deleteUser(id, setShowModal, Users) {
    // console.log(id);
    // Users()
    const result = await fetch(`http://localhost:4000/users/delete?id=${id}`, {
        method: 'DELETE'
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
            setShowModal("close")
            Users()
        })
    }
}

export default deleteUser