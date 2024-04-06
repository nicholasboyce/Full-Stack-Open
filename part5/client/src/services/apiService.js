const getAll = async (baseUrl) => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data;
}

const getUserBlogs = async (baseUrl, token) => {
    const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
            Authorization: token,
        }
    });
    const data = await response.json();
    return data;
}


const login = async (baseUrl, credentials) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    console.log(data);
    return data;
}

export default { getAll, getUserBlogs, login }