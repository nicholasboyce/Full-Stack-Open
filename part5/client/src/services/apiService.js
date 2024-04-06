let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = async (baseUrl) => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data;
}

const getUserBlogs = async (baseUrl) => {
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
    return response;
}

export default { setToken, getAll, getUserBlogs, login }