import axios from 'axios';
const baseURL = '/api/persons';

const getAllPersons = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

const createNewPerson = (personObject) => {
    const request = axios.post(baseURL, personObject);
    return request.then(response => response.data);
}

const updatePerson = (id, personObject) => {
    const request = axios.put(`${baseURL}/${id}`, personObject);
    return request.then(response => response.data);
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseURL}/${id}`);
    return request.then(response => response.data);
}

export { getAllPersons, createNewPerson, updatePerson, deletePerson }