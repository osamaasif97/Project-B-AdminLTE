async function getUser(id) {
    const result = await fetch(`http://localhost:4000/users/find?id=${id}`, {
        method: 'GET'
    }).then((req) => req.json())
    if (result.status === 'ok') {
        return result.data
    }
}

export default getUser