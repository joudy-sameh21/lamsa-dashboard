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
  CRow,
  CCol,
  CAlert,
  CContainer,
} from "@coreui/react";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ status: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch payments
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/payment`)
      .then((res) => res.json())
      .then((data) => setPayments(data.data || data.payments || []))
      .catch((err) => setError("Failed to fetch payments"));
  }, []);

  // Handle input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Start editing
  const handleEdit = (payment) => {
    setEditingId(payment._id);
    setForm({ status: payment.status || "" });
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status }),
      });

      if (!res.ok) throw new Error("Failed to update payment");

      const result = await res.json();
      setSuccess("Payment updated successfully!");

      // Update payments list inline
      const updated = payments.map((p) =>
        p._id === editingId ? { ...p, status: form.status } : p
      );
      setPayments(updated);

      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CContainer className="py-4">
      {editingId && (
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Edit Payment Status</h4>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {success && <CAlert color="success">{success}</CAlert>}
            <CForm onSubmit={handleUpdate}>
              <CRow className="g-3 align-items-center">
                <CCol md={4}>
                  <CFormInput
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    placeholder="Status"
                    required
                    label="Status"
                  />
                </CCol>
                <CCol md={4}>
                  <CButton type="submit" color="warning" className="me-2" style={{ marginTop: 20 }}>
                    Update
                  </CButton>
                  <CButton color="secondary" onClick={() => setEditingId(null)} style={{ marginTop: 20 }}>
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      )}

      <CCard>
        <CCardHeader>
          <h4>Payments</h4>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Order ID</CTableHeaderCell>
                <CTableHeaderCell>Amount (EGP)</CTableHeaderCell>
                <CTableHeaderCell>Method</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Error Message</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {payments.map((payment) => (
                <CTableRow key={payment._id}>
                  <CTableDataCell>{payment.user?.username || "N/A"}</CTableDataCell>
                  <CTableDataCell>{payment.user?.email || "N/A"}</CTableDataCell>
                  <CTableDataCell>{payment.orderId}</CTableDataCell>
                  <CTableDataCell>{payment.amount}</CTableDataCell>
                  <CTableDataCell>{payment.paymentMethod}</CTableDataCell>
                  <CTableDataCell>{payment.status}</CTableDataCell>
                  <CTableDataCell>{new Date(payment.createdAt).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>
                    {payment.paymentDetails?.redirectDetails?.["data.message"] || "—"}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      style={{ backgroundColor: "rgb(170, 218, 170)" }}
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
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
