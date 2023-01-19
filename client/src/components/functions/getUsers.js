async function allUsers() {
    const result = await fetch("http://localhost:4000/users/all", {
        method: 'GET',
    }).then((req) => req.json())
    if (result.status === 'ok') {
        return result.data
    }
}

export default allUsers