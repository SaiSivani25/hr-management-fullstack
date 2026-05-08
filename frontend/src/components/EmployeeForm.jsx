import { useState } from 'react'
import { createEmployee, updateEmployee } from '../services/employeeService'

const INITIAL_STATE = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
  job_title: '',
  salary: '',
  company_id: '',
}

const FIELDS = [
  { name: 'employee_id', label: 'Employee ID', type: 'text' },
  { name: 'full_name', label: 'Full Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'department', label: 'Department', type: 'text' },
  { name: 'job_title', label: 'Job Title', type: 'text' },
  { name: 'salary', label: 'Salary', type: 'number' },
  { name: 'company_id', label: 'Company ID', type: 'text' },
]

export default function EmployeeForm({ employee, existingIds = [], companies = [], onClose, onSuccess }) {
  const isEdit = !!employee
  const [form, setForm] = useState(
    isEdit ? { ...employee, salary: String(employee.salary) } : INITIAL_STATE
  )
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required'
    else if (!isEdit && existingIds.includes(form.employee_id.trim())) errs.employee_id = 'Employee ID already exists'
    if (!form.full_name.trim()) errs.full_name = 'Full name is required'
    else if (!/^[a-zA-Z\s]+$/.test(form.full_name)) errs.full_name = 'Name must contain only letters'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.department.trim()) errs.department = 'Department is required'
    else if (!/^[a-zA-Z\s]+$/.test(form.department)) errs.department = 'Department must contain only letters'
    if (!form.job_title.trim()) errs.job_title = 'Job title is required'
    else if (!/^[a-zA-Z\s]+$/.test(form.job_title)) errs.job_title = 'Job title must contain only letters'
    if (!form.salary) errs.salary = 'Salary is required'
    else if (isNaN(Number(form.salary)) || Number(form.salary) <= 0) errs.salary = 'Salary must be a positive number'
    if (!form.company_id.trim()) errs.company_id = 'Company ID is required'
    else if (!companies.some(c => c.company_id === form.company_id.trim())) errs.company_id = 'Company ID does not exist. Please enter a valid company ID'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    try {
      setSubmitting(true)
      const payload = { ...form, salary: Number(form.salary) }
      if (isEdit) {
        await updateEmployee(employee.employee_id, payload)
      } else {
        await createEmployee(payload)
      }
      onSuccess()
    } catch {
      alert('Failed to save employee.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {FIELDS.map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                disabled={isEdit && name === 'employee_id'}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[name] ? 'border-red-400' : 'border-gray-300'
                } ${isEdit && name === 'employee_id' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
