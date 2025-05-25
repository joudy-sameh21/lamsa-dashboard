import React, { useEffect, useState } from 'react'
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

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [housekeepers, setHousekeepers] = useState([])
  const [form, setForm] = useState({
    user: '',
    housekeeper: '',
    day: '',
    date: '',
    timeStart: '',
    timeEnd: '',
    totalPrice: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch bookings
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data?.data?.bookings || []))
  }, [])

  // Fetch users and housekeepers for dropdowns
  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/users`)
    .then((res) => res.json())
    .then((data) => setUsers(data?.data?.users || []));
   fetch(`${import.meta.env.VITE_API_URL}/housekeeper`)
    .then((res) => res.json())
    .then((data) => {
      console.log('Housekeepers:', data?.data?.docs);
      setHousekeepers(data?.data?.docs || []);
    });
}, []);

  // Handle form input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Create booking
  const handleCreate = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Format date and time
  const isoDate = new Date(form.date).toISOString();
  const time = `${form.timeStart}-${form.timeEnd}`;

  const payload = {
    ...form,
    date: isoDate,
    time,
  };
  delete payload.timeStart;
  delete payload.timeEnd;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    setSuccess('Booking created successfully!');
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    setError(err.message);
  }
};
  // Edit booking
  const handleEdit = (booking) => {
  const [timeStart = '', timeEnd = ''] = (booking.time || '').split('-');
  setEditingId(booking._id);
  setForm({
    user: booking.user?._id || booking.user || '',
    housekeeper: booking.housekeeper?._id || booking.housekeeper || '',
    day: booking.day || '',
    date: booking.date ? new Date(booking.date).toISOString().slice(0, 10) : '',
    timeStart,
    timeEnd,
    totalPrice: booking.totalPrice || '',
  });
};
  // Update booking
  const handleUpdate = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Format date and time
  const isoDate = new Date(form.date).toISOString();
  const time = `${form.timeStart}-${form.timeEnd}`;

  const payload = {
    ...form,
    date: isoDate,
    time,
  };
  delete payload.timeStart;
  delete payload.timeEnd;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update booking');
    setSuccess('Booking updated successfully!');
    setEditingId(null);
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    setError(err.message);
  }
};

  // Delete booking
  const handleDelete = async (id) => {
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/cancel/${id}`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Failed to delete booking')
      setSuccess('Booking deleted successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">{editingId ? 'Edit Booking' : 'Add Booking'}</h4>
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
                  {users.map((user) => (
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
                  {housekeepers.map((hk) => (
                    <option key={hk._id} value={hk._id}>
                      {hk.name} ({hk._id})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
  <CFormSelect
    name="day"
    value={form.day}
    onChange={handleChange}
    required
    label="Day"
  >
    <option value="">Select Day</option>
    <option value="Sunday">Sunday</option>
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
    <option value="Saturday">Saturday</option>
  </CFormSelect>
</CCol>
              <CCol md={2}>
  <CFormInput
    name="date"
    value={form.date}
    onChange={handleChange}
    placeholder="Date"
    required
    label="Date"
    type="date"
  />
</CCol>
<CCol md={1}>
  <CFormInput
    name="timeStart"
    value={form.timeStart}
    onChange={handleChange}
    placeholder="Start"
    required
    label="Start Time"
    type="time"
  />
</CCol>
<CCol md={1}>
  <CFormInput
    name="timeEnd"
    value={form.timeEnd}
    onChange={handleChange}
    placeholder="End"
    required
    label="End Time"
    type="time"
  />
</CCol>
              <CCol md={2}>
                <CFormInput
                  name="totalPrice"
                  value={form.totalPrice}
                  onChange={handleChange}
                  placeholder="Total Price"
                  required
                  label="Total Price"
                  type="number"
                />
              </CCol>
              <CCol md={12} className="mt-2">
                <CButton  type="submit" className="me-2" style={{ backgroundColor: 'rgb(170, 218, 170)', borderColor: 'rgb(170, 218, 170)', color: '#222' }}>
                  {editingId ? 'Update' : 'Create'}
                </CButton>
                {editingId && (
                  <CButton
  color="secondary"
  onClick={() => {
    setEditingId(null);
    setForm({
      user: '',
      housekeeper: '',
      day: '',
      date: '',
      timeStart: '',
      timeEnd: '',
      totalPrice: '',
    });
  }}
>
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
          <h4 className="mb-0">Bookings List</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                {bookings[0] &&
                  Object.keys(bookings[0]).map((key) => (
                    <CTableHeaderCell key={key}>{key}</CTableHeaderCell>
                  ))}

              </CTableRow>
            </CTableHead>
            <CTableBody>
              {bookings.map((booking) => (
                <CTableRow key={booking._id}>
                  <CTableDataCell>{booking._id}</CTableDataCell>
                  <CTableDataCell>{booking.user?.username || booking.user?._id}</CTableDataCell>
                  <CTableDataCell>
                    {booking.housekeeper?.name || booking.housekeeper?._id}
                  </CTableDataCell>
                  <CTableDataCell>{booking.day}</CTableDataCell>
                  <CTableDataCell>
                    {booking.date ? new Date(booking.date).toLocaleString() : ''}
                  </CTableDataCell>
                  <CTableDataCell>{booking.time}</CTableDataCell>
                  <CTableDataCell>{booking.totalPrice}</CTableDataCell>
                  <CTableDataCell>{booking.paymentStatus}</CTableDataCell>
                  <CTableDataCell>{booking.status}</CTableDataCell>
                  <CTableDataCell>
  <CButton
    size="sm"
    className="me-3"
    style={{
      backgroundColor: 'rgb(170, 218, 170)',
      borderColor: 'rgb(170, 218, 170)',
      color: '#222',
      minWidth: 60,
    }}
    onClick={() => handleEdit(booking)}
  >
    Edit
  </CButton>
  <CButton
    color="danger"
    size="sm"
    style={{ minWidth: 60 }}
    onClick={() => handleDelete(booking._id)}
  >
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
  )
}

export default Bookings