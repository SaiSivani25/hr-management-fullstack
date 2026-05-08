import { useState } from 'react'
import EmployeeTable from './components/EmployeeTable'
import CompanyTable from './components/CompanyTable'

function App() {
  const [activeTab, setActiveTab] = useState('employees')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">HR Management System</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-6 py-2 font-medium text-sm rounded-t-md transition-colors ${
              activeTab === 'employees'
                ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-2 font-medium text-sm rounded-t-md transition-colors ${
              activeTab === 'companies'
                ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Companies
          </button>
        </div>
        {activeTab === 'employees' ? <EmployeeTable /> : <CompanyTable />}
      </main>
    </div>
  )
}

export default App
