import swal from 'sweetalert'
async function positionChanger(startIndex, endIndex, row1, row2) {
    const result = await fetch(`http://localhost:4000/users/changePositon`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({
            startIndex,
            endIndex,
            row1,
            row2
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
        })
    }
}

export default positionChanger