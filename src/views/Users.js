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
} from '@coreui/react';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user"
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/getUsers`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || data.data?.users || data.data || []);
      })
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to create user');
      setSuccess('User created successfully!');
      setForm({ username: "", email: "", password: "", phoneNumber: "", role: "user" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = user => {
    setEditingId(user._id);
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "user"
    });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const updateForm = { ...form };
    delete updateForm.password; // Password updates not allowed here
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm)
      });
      if (!res.ok) throw new Error('Failed to update user');
      setSuccess('User updated successfully!');
      setEditingId(null);
      setForm({ username: "", email: "", password: "", phoneNumber: "", role: "user" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/deleteMe`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false })  // soft delete
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setSuccess('User deleted (deactivated) successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

   return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">{editingId ? "Edit User" : "Add User"}</h4>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          <CForm onSubmit={editingId ? handleUpdate : handleCreate}>
            <CRow className="g-3 align-items-center">
              <CCol md={2}>
                <CFormInput
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  label="Username"
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  label="Email"
                  type="email"
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={editingId ? "Leave blank to keep current" : "Password"}
                  label="Password"
                  type="password"
                  required={!editingId}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  label="Phone Number"
                  type="tel"
                />
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  label="Role"
                  options={[
                    { label: "User", value: "user" },
                    { label: "Admin", value: "admin" }
                  ]}
                  required
                />
              </CCol>
              <CCol md={2}>
                <CButton style={{
      backgroundColor: 'rgb(83, 142, 83)'}} type="submit" className="me-2">
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
          <h4 className="mb-0">Users List</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
  <CTableRow>
    <CTableHeaderCell>#</CTableHeaderCell>
    <CTableHeaderCell>Username</CTableHeaderCell>
    <CTableHeaderCell>User ID</CTableHeaderCell>
    <CTableHeaderCell>Actions</CTableHeaderCell>
  </CTableRow>
</CTableHead>
<CTableBody>
  {users.map((user, index) => (
    <CTableRow key={user._id}>
      <CTableDataCell>{index + 1}</CTableDataCell>
      <CTableDataCell>{user.username}</CTableDataCell>
      <CTableDataCell>{user._id}</CTableDataCell>
      <CTableDataCell>
        <CButton style={{
      backgroundColor: 'rgb(91, 180, 91)'}} size="sm" className="me-2" onClick={() => handleEdit(user)}>
          Edit
        </CButton>
        <CButton color="danger" size="sm" onClick={() => handleDelete(user._id)}>
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


export default Users;
