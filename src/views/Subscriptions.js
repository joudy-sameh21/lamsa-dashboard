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

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({
    user: "",
    orderId: "",
    amount: "",
    subscriptionPlan: "",
    expiryDate: "",
    status: "",
    paymentMethod: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch subscriptions
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/subscription-payments/all`)
      .then(res => res.json())
      .then(data => setSubscriptions(data.data.subscriptions || []))
      .catch(err => console.error("Failed to fetch subscriptions:", err));
  }, []);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Edit subscription
  const handleEdit = sub => {
    setEditingId(sub._id);
    setForm({
      user: sub.user || "",
      orderId: sub.orderId || "",
      amount: sub.amount || "",
      subscriptionPlan: sub.subscriptionPlan || "",
      expiryDate: sub.expiryDate ? sub.expiryDate.substring(0, 10) : "",
      status: sub.status || "",
      paymentMethod: sub.paymentMethod || ""
    });
  };

  // Update subscription
  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscription-payments/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update subscription');
      setSuccess('Subscription updated successfully!');
      setEditingId(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete subscription
  const handleDelete = async id => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscription-payments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error('Failed to delete subscription');
      setSuccess('Subscription deleted successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CContainer className="py-4">
      {editingId && (
        <CCard>
          <CCardHeader>
            <h4 className="mb-0">Edit Subscription</h4>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {success && <CAlert color="success">{success}</CAlert>}
            <CForm onSubmit={handleUpdate}>
              <CRow className="g-3 align-items-center">
                <CCol md={2}>
                  <CFormInput
                    name="user"
                    value={form.user}
                    onChange={handleChange}
                    placeholder="User ID"
                    required
                    label="User ID"
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    name="orderId"
                    value={form.orderId}
                    onChange={handleChange}
                    placeholder="Order ID"
                    required
                    label="Order ID"
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
                  <CFormSelect
                    name="subscriptionPlan"
                    value={form.subscriptionPlan}
                    onChange={handleChange}
                    label="Subscription Plan"
                    required
                    options={[
                      { label: "Select Plan", value: "" },
                      { label: "Basic", value: "basic" },
                      { label: "Premium", value: "premium" }
                    ]}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    placeholder="Expiry Date"
                    required
                    label="Expiry Date"
                    type="date"
                  />
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    label="Status"
                    options={[
                      { label: "Pending", value: "pending" },
                      { label: "Active", value: "active" },
                      { label: "Expired", value: "expired" }
                    ]}
                    required
                  />
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    label="Payment Method"
                    options={[
                      { label: "Card", value: "card" },
                      { label: "Cash", value: "cash" }
                    ]}
                    required
                  />
                </CCol>
                <CCol md={2}>
                  <CButton color="primary" type="submit" className="me-2">
                    Update
                  </CButton>
                  <CButton color="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      )}

      <CCard className="mt-4">
        <CCardHeader>
          <h4 className="mb-0">Subscriptions List</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Subscribed</CTableHeaderCell>
                <CTableHeaderCell>Plan</CTableHeaderCell>
                <CTableHeaderCell>Expiry Date</CTableHeaderCell>
                <CTableHeaderCell>User ID</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {subscriptions.map(sub => (
                <CTableRow key={sub._id}>
                  <CTableDataCell>{sub.username}</CTableDataCell>
                  <CTableDataCell>{sub.email}</CTableDataCell>
                  <CTableDataCell>{sub.isSubscribed ? "Yes" : "No"}</CTableDataCell>
                  <CTableDataCell>{sub.subscriptionPlan || "N/A"}</CTableDataCell>
                  <CTableDataCell>{sub.subscriptionExpiryDate ? new Date(sub.subscriptionExpiryDate).toLocaleDateString() : "N/A"}</CTableDataCell>
                  <CTableDataCell>{sub._id}</CTableDataCell>
                  <CTableDataCell>
                    <CButton style={{
      backgroundColor: 'rgb(170, 218, 170)'}} size="sm" className="me-2" onClick={() => handleEdit(sub)}>
                      Edit
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(sub._id)}>
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

export default Subscriptions;
