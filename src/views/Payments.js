import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CAlert,
  CContainer,
} from '@coreui/react'

function Payments() {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [housekeepers, setHousekeepers] = useState([]);
  const [form, setForm] = useState({
    user: "",
    housekeeper: "",
    booking: "",
    amount: "",
    status: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch payments
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/payments`)
      .then(res => res.json())
      .then(data => setPayments(data.data || data.payments || []));
  }, []);

  // Fetch users and housekeepers for dropdowns
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data?.data?.users || []));
    fetch(`${import.meta.env.VITE_API_URL}/housekeeper`)
      .then(res => res.json())
      .then(data => setHousekeepers(data?.data?.docs || []));
  }, []);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create payment
  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to create payment');
      setSuccess('Payment created successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit payment
  const handleEdit = payment => {
    setEditingId(payment._id);
    setForm({
      user: payment.user || "",
      housekeeper: payment.housekeeper || "",
      booking: payment.booking || "",
      amount: payment.amount || "",
      status: payment.status || ""
    });
  };

  // Update payment
  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update payment');
      setSuccess('Payment updated successfully!');
      setEditingId(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete payment
  const handleDelete = async id => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error('Failed to delete payment');
      setSuccess('Payment deleted successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">{editingId ? "Edit Payment" : "Add Payment"}</h4>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          <CForm onSubmit={editingId ? handleUpdate : handleCreate}>
            <CRow className="g-3 align-items-center">
              <CCol md={2}>
                <CFormSelect
                  name="user"
                  value={form.user}
                  onChange={handleChange}
                  required
                  label="User"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user._id})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  name="housekeeper"
                  value={form.housekeeper}
                  onChange={handleChange}
                  required
                  label="Housekeeper"
                >
                  <option value="">Select Housekeeper</option>
                  {housekeepers.map(hk => (
                    <option key={hk._id} value={hk._id}>
                      {hk.name} ({hk._id})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="booking"
                  value={form.booking}
                  onChange={handleChange}
                  placeholder="Booking ID"
                  required
                  label="Booking ID"
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  required
                  label="Amount"
                  type="number"
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="Status"
                  required
                  label="Status"
                />
              </CCol>
              <CCol md={2}>
                <CButton  type="submit" className="me-2" style={{ backgroundColor: 'rgb(170, 218, 170)', borderColor: 'rgb(170, 218, 170)', color: '#222', marginTop: 20 }}>
                  {editingId ? "Update" : "Create"}
                </CButton>
                {editingId && (
                  <CButton color="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <CCard className="mt-4">
        <CCardHeader>
          <h4 className="mb-0">Payments List</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                {payments[0] && Object.keys(payments[0]).map(key => (
                  <CTableHeaderCell key={key}>{key}</CTableHeaderCell>
                ))}
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {payments.map(payment => (
                <CTableRow key={payment._id}>
                  {Object.keys(payment).map(key => (
                    <CTableDataCell key={key}>
                      {typeof payment[key] === 'object' ? JSON.stringify(payment[key]) : String(payment[key])}
                    </CTableDataCell>
                  ))}
                  <CTableDataCell>
                    <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(payment)}>
                      Edit
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(payment._id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  );
}

export default Payments;