import { useState } from 'react'
import { createCompany, updateCompany } from '../services/companyService'

const INITIAL_STATE = {
  company_id: '',
  company_name: '',
  industry: '',
  employee_count: '',
  annual_revenue: '',
}

const FIELDS = [
  { name: 'company_id', label: 'Company ID', type: 'text' },
  { name: 'company_name', label: 'Company Name', type: 'text' },
  { name: 'industry', label: 'Industry', type: 'text' },
  { name: 'employee_count', label: 'Employee Count', type: 'number' },
  { name: 'annual_revenue', label: 'Annual Revenue', type: 'number' },
]

export default function CompanyForm({ company, existingIds = [], onClose, onSuccess }) {
  const isEdit = !!company
  const [form, setForm] = useState(
    isEdit
      ? {
          ...company,
          employee_count: String(company.employee_count),
          annual_revenue: String(company.annual_revenue),
        }
      : INITIAL_STATE
  )
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.company_id.trim()) errs.company_id = 'Company ID is required'
    else if (!isEdit && existingIds.includes(form.company_id.trim())) errs.company_id = 'Company ID already exists'
    if (!form.company_name.trim()) errs.company_name = 'Company name is required'
    else if (!/^[a-zA-Z\s]+$/.test(form.company_name)) errs.company_name = 'Company name must contain only letters'
    if (!form.industry.trim()) errs.industry = 'Industry is required'
    else if (!/^[a-zA-Z\s]+$/.test(form.industry)) errs.industry = 'Industry must contain only letters'
    if (!form.employee_count) errs.employee_count = 'Employee count is required'
    else if (isNaN(Number(form.employee_count)) || Number(form.employee_count) <= 0)
      errs.employee_count = 'Employee count must be a positive number'
    if (!form.annual_revenue) errs.annual_revenue = 'Annual revenue is required'
    else if (isNaN(Number(form.annual_revenue)) || Number(form.annual_revenue) <= 0)
      errs.annual_revenue = 'Annual revenue must be a positive number'
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
      const payload = {
        ...form,
        employee_count: parseInt(form.employee_count, 10),
        annual_revenue: Number(form.annual_revenue),
      }
      if (isEdit) {
        await updateCompany(company.company_id, payload)
      } else {
        await createCompany(payload)
      }
      onSuccess()
    } catch {
      alert('Failed to save company.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Edit Company' : 'Add Company'}
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
                disabled={isEdit && name === 'company_id'}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[name] ? 'border-red-400' : 'border-gray-300'
                } ${isEdit && name === 'company_id' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
