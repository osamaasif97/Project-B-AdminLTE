async function activeStatus(Data, setCheck) {
    if (Data) {
        const result = await fetch('http://localhost:4000/users/activeStatus', {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({
                Data
            })
        }).then((req) => req.json())
        if (result.status === 'ok') {
            // setTimeout(function () {
            // }, 1000)
            setCheck(true)
        }
    }
}


export default activeStatus