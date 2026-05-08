import { useState, useEffect } from 'react'
import { getCompanies, deleteCompany } from '../services/companyService'
import CompanyForm from './CompanyForm'

export default function CompanyTable() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getCompanies()
      setCompanies(res.data)
    } catch {
      setError('Failed to fetch companies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return
    try {
      await deleteCompany(id)
      setCompanies(prev => prev.filter(c => c.company_id !== id))
    } catch {
      alert('Failed to delete company.')
    }
  }

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setShowForm(true)
  }

  const handleAdd = () => {
    setSelectedCompany(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedCompany(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchCompanies()
  }

  const filtered = companies.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-sm">Loading companies...</p>
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
          placeholder="Search by name or industry..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Company
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Company ID', 'Company Name', 'Industry', 'Employee Count', 'Annual Revenue', 'Actions'].map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                  No companies found.
                </td>
              </tr>
            ) : (
              filtered.map(company => (
                <tr key={company.company_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{company.company_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{company.company_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{company.industry}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{Number(company.employee_count).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${Number(company.annual_revenue).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company.company_id)}
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
        <CompanyForm
          company={selectedCompany}
          existingIds={companies.map(c => c.company_id)}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
