import { useState, useEffect } from 'react'
import { getEmployees, deleteEmployee } from '../services/employeeService'
import { getCompanies } from '../services/companyService'
import EmployeeForm from './EmployeeForm'

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getEmployees()
      setEmployees(res.data)
    } catch {
      setError('Failed to fetch employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    getCompanies().then(res => setCompanies(res.data)).catch(() => {})
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    try {
      await deleteEmployee(id)
      setEmployees(prev => prev.filter(e => e.employee_id !== id))
    } catch {
      alert('Failed to delete employee.')
    }
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setShowForm(true)
  }

  const handleAdd = () => {
    setSelectedEmployee(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedEmployee(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchEmployees()
  }

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-sm">Loading employees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Employee
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Employee ID', 'Full Name', 'Email', 'Department', 'Job Title', 'Salary', 'Company ID', 'Actions'].map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map(employee => (
                <tr key={employee.employee_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{employee.employee_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{employee.full_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{employee.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{employee.job_title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${Number(employee.salary).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{employee.company_id}</td>
                  <td className="px-4 py-3 text-sm space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.employee_id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          existingIds={employees.map(e => e.employee_id)}
          companies={companies}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
