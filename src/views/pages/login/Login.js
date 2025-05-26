import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const admins = [
  { name: "Joudy", email: "joudy@admin.com", password: "joudy123" },
  { name: "Farida", email: "farida@admin.com", password: "farida123" },
  { name: "Maya", email: "maya@admin.com", password: "maya123" },
  { name: "Merna", email: "merna@admin.com", password: "merna123" },
  { name: "Admin", email: "admin@admin.com", password: "admin123" },
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = admins.find(
      admin => admin.email === form.email && admin.password === form.password
    )
    if (found) {
      localStorage.setItem('admin-auth', 'true')
      localStorage.setItem('admin-name', found.name)
      navigate('/')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your admin account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
                    <CRow>
                      <CCol xs={6}>
                        <CButton style={{ backgroundColor: 'rgb(125, 190, 125)'}} className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login