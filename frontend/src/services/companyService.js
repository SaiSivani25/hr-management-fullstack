import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

export const getCompanies = () => axios.get(`${BASE_URL}/companies`)
export const createCompany = (data) => axios.post(`${BASE_URL}/companies`, data)
export const updateCompany = (id, data) => axios.put(`${BASE_URL}/companies/${id}`, data)
export const deleteCompany = (id) => axios.delete(`${BASE_URL}/companies/${id}`)
