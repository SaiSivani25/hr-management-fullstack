import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

export const getEmployees = () => axios.get(`${BASE_URL}/employees`)
export const createEmployee = (data) => axios.post(`${BASE_URL}/employees`, data)
export const updateEmployee = (id, data) => axios.put(`${BASE_URL}/employees/${id}`, data)
export const deleteEmployee = (id) => axios.delete(`${BASE_URL}/employees/${id}`)
