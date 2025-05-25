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
  CFormTextarea,
  CRow,
  CCol,
  CAlert,
  CContainer,
} from '@coreui/react'

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

function Housekeepers() {
  const [housekeepers, setHousekeepers] = useState([]);
  const [rawData, setRawData] = useState(null); // save raw response for debugging
  const [form, setForm] = useState({
    user: "",
    name: "",
    description: "",
    age: "",
    experience: "",
    skills: "",
    photo: null
  });
  // Use times as array of {start, end}
  const [availabilityList, setAvailabilityList] = useState([
    { day: '', date: '', times: [{ start: '', end: '' }] }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch housekeepers
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/housekeeper`)
      .then(res => res.json())
      .then(data => {
      console.log("Raw API response:", data); // Inspect the full response
      setRawData(data); // Save full response
      const hkList =
        data.housekeepers ||
        data.data?.housekeepers ||
        data?.data?.docs ||
        data.data ||
        [];
      setHousekeepers(hkList);
    })
    .catch(err => console.error("Error fetching housekeepers:", err));
  }, []);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Availability handlers
  const handleAvailabilityChange = (idx, field, value) => {
    const updated = [...availabilityList];
    updated[idx][field] = value;
    setAvailabilityList(updated);
  };

  const handleTimeChange = (idx, tIdx, field, value) => {
    const updated = [...availabilityList];
    updated[idx].times[tIdx][field] = value;
    setAvailabilityList(updated);
  };

  const addAvailability = () => {
    setAvailabilityList([...availabilityList, { day: '', date: '', times: [{ start: '', end: '' }] }]);
  };

  const removeAvailability = idx => {
    setAvailabilityList(availabilityList.filter((_, i) => i !== idx));
  };

  const addTime = idx => {
    const updated = [...availabilityList];
    updated[idx].times.push({ start: '', end: '' });
    setAvailabilityList(updated);
  };

  const removeTime = (idx, tIdx) => {
    const updated = [...availabilityList];
    updated[idx].times = updated[idx].times.filter((_, i) => i !== tIdx);
    setAvailabilityList(updated);
  };

  const handleCreate = async e => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const formData = new FormData();
    formData.append("user", form.user);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("age", form.age);
    formData.append("experience", form.experience);
    formData.append("photo", form.photo); // ✅ Correct key for photo

    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    formData.append("skills", JSON.stringify(skillsArray));

    const formattedAvailability = availabilityList.map(a => ({
      ...a,
      times: a.times.map(t => t.start && t.end ? `${t.start}-${t.end}` : '').filter(Boolean)
    }));
    formData.append("availability", JSON.stringify(formattedAvailability));

    const res = await fetch(`${import.meta.env.VITE_API_URL}/housekeeper`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error('Failed to create housekeeper');
    setSuccess('Housekeeper created successfully!');
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    setError('Failed to create housekeeper. Please check your input.');
  }
};


  // Edit housekeeper
  const handleEdit = hk => {
    setEditingId(hk._id);
    setForm({
      user: hk.user || hk._id,
      name: hk.name || "",
      description: hk.description || "",
      age: hk.age || "",
      experience: hk.experience || "",
      skills: Array.isArray(hk.skills) ? hk.skills.join(', ') : "",
    });
    setAvailabilityList(
      Array.isArray(hk.availability) && hk.availability.length > 0
        ? hk.availability.map(a => ({
            day: a.day || '',
            date: a.date || '',
            times: Array.isArray(a.times)
              ? a.times.map(t => {
                  if (typeof t === 'string' && t.includes('-')) {
                    const [start, end] = t.split('-');
                    return { start: start.trim(), end: end.trim() };
                  }
                  if (typeof t === 'object' && t.start && t.end) return t;
                  return { start: '', end: '' };
                })
              : [{ start: '', end: '' }]
          }))
        : [{ day: '', date: '', times: [{ start: '', end: '' }] }]
    );
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    // Update textual data (without image)
    const payload = {
      user: form.user,
      name: form.name,
      description: form.description,
      age: form.age,
      experience: form.experience,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      availability: availabilityList.map(a => ({
        ...a,
        times: a.times.map(t => t.start && t.end ? `${t.start}-${t.end}` : '').filter(Boolean)
      }))
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/housekeeper/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to update housekeeper details');

    // ✅ Upload image if one is selected
    if (form.photo) {
      const formData = new FormData();
      formData.append("image", form.photo);

      const photoRes = await fetch(`${import.meta.env.VITE_API_URL}/housekeeper/${editingId}/photo`, {
        method: "PATCH",
        body: formData
      });

      if (!photoRes.ok) throw new Error('Failed to upload photo');
    }

    setSuccess("Housekeeper updated successfully!");
    setEditingId(null);
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    setError(err.message || 'Update failed');
  }
};



  // Delete housekeeper
  const handleDelete = async id => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/housekeeper/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error('Failed to delete housekeeper');
      setSuccess('Housekeeper deleted successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Styling helpers ---
  const availabilityCardStyle = {
    // border removed
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    boxShadow: '0 2px 8px rgba(46,204,64,0.08)'
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: 16,
    color: '#aadaaa',
    marginBottom: 8,
    letterSpacing: 0.5
  };

  const addBtnStyle = {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
    color: '#fff',
    fontWeight: 500,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8
  };

  const removeBtnStyle = {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
    color: '#fff',
    fontWeight: 500,
    borderRadius: 8
  };

  const timeBtnStyle = {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
    color: '#fff',
    fontWeight: 500,
    borderRadius: 8,
    marginLeft: 4
  };

  return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>
          <h3 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
            {editingId ? "Edit Housekeeper" : "Add Housekeeper"}
          </h3>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          <CForm onSubmit={editingId ? handleUpdate : handleCreate}>
            <CRow className="g-4 align-items-center">
              <CCol md={3}>
                <CFormInput
                  name="user"
                  value={form.user}
                  onChange={handleChange}
                  placeholder="User ID"
                  required
                  label="User ID"
                  style={{ background: "#23272f", borderRadius: 8 }}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  label="Name"
                  style={{ background: "#23272f", borderRadius: 8 }}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  label="Age"
                  type="number"
                  style={{ background: "#23272f", borderRadius: 8 }}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Experience (years)"
                  required
                  label="Experience"
                  type="number"
                  style={{ background: "#23272f", borderRadius: 8 }}
                />
              </CCol>
              <CCol md={6}>
                <CFormTextarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                  label="Description"
                  rows={2}
                  style={{ background: "#23272f", borderRadius: 8 }}
                />
              </CCol>
              <CCol md={6}>
  <label style={{ fontWeight: 500 }}>Photo</label>
  <input
    type="file"
    accept="image/*"
    className="form-control"
    onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
    style={{ background: "#23272f", borderRadius: 8 }}
  />
</CCol>

              <CCol md={6}>
                <CFormInput
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Skills (comma separated)"
                  label="Skills"
                  style={{ background: "#23272f", borderRadius: 8 }}
                />
              </CCol>
              <CCol md={12}>
                <div style={{marginBottom: 8}}>Availability</div>
                {availabilityList.map((a, idx) => (
                  <div key={idx} style={availabilityCardStyle}>
                    <CRow className="g-3 align-items-center">
                      <CCol md={3}>
                        <label style={{fontWeight: 500 }}>Day</label>
                        <select
                          className="form-select"
                          value={a.day}
                          onChange={e => handleAvailabilityChange(idx, 'day', e.target.value)}
                          style={{ background: "#23272f", borderRadius: 8 }}
                        >
                          <option value="">Select Day</option>
                          {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </CCol>
                      <CCol md={3}>
                        <label style={{ fontWeight: 500 }}>Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={a.date}
                          onChange={e => handleAvailabilityChange(idx, 'date', e.target.value)}
                          style={{ background: "#23272f", borderRadius: 8 }}
                        />
                      </CCol>
                      <CCol md={5}>
                        <label style={{fontWeight: 500 }}>Time Ranges</label>
                        {a.times.map((t, tIdx) => (
                          <div key={tIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                            <input
                              type="time"
                              className="form-control"
                              placeholder="Start"
                              value={t.start}
                              onChange={e => handleTimeChange(idx, tIdx, 'start', e.target.value)}
                              style={{ background: "#23272f", borderRadius: 8, marginRight: 8, minWidth: 100 }}
                            />
                            <span style={{margin: "0 6px" }}>to</span>
                            <input
                              type="time"
                              className="form-control"
                              placeholder="End"
                              value={t.end}
                              onChange={e => handleTimeChange(idx, tIdx, 'end', e.target.value)}
                              style={{ background: "#23272f", borderRadius: 8, marginRight: 8, minWidth: 100 }}
                            />
                            <CButton
                              style={removeBtnStyle}
                              size="sm"
                              onClick={() => removeTime(idx, tIdx)}
                              disabled={a.times.length === 1}
                            >-</CButton>
                          </div>
                        ))}
                        <CButton style={timeBtnStyle} size="sm" onClick={() => addTime(idx)}>
                          + Add Time
                        </CButton>
                      </CCol>
                      <CCol md={1} className="d-flex align-items-end justify-content-end">
                        <CButton
                          style={removeBtnStyle}
                          size="sm"
                          onClick={() => removeAvailability(idx)}
                          disabled={availabilityList.length === 1}
                        >
                          Remove
                        </CButton>
                      </CCol>
                    </CRow>
                  </div>
                ))}
                <CButton style={addBtnStyle} size="sm" onClick={addAvailability}>
                  + Add Availability
                </CButton>
              </CCol>
              <CCol md={12} className="mt-3">
                <CButton
                  type="submit"
                  className="me-2"
                  style={{
                    backgroundColor: 'rgb(170, 218, 170)',
                    borderColor: 'rgb(170, 218, 170)',
                    color: '#222',
                    fontWeight: 600,
                    borderRadius: 8,
                    minWidth: 120,
                  }}
                >
                  {editingId ? "Update" : "Create"}
                </CButton>
                {editingId && (
                  <CButton
                    color="secondary"
                    style={{ borderRadius: 8, minWidth: 120, fontWeight: 600 }}
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        user: "",
                        name: "",
                        description: "",
                        age: "",
                        experience: "",
                        skills: "",
                        photo: null
                      });
                      setAvailabilityList([{ day: '', date: '', times: [{ start: '', end: '' }] }]);
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
          <h3 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
            Housekeepers List
          </h3>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered align="middle" className="bg-dark text-light">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Photo</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell>Age</CTableHeaderCell>
                <CTableHeaderCell>Experience</CTableHeaderCell>
                <CTableHeaderCell>Skills</CTableHeaderCell>
                <CTableHeaderCell>Price/㎡</CTableHeaderCell>
                <CTableHeaderCell>Availability</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {housekeepers.map(hk => (
                <CTableRow key={hk._id || index}>
                  <CTableDataCell>
                    <img
                      src={hk.photo}
                      alt={hk.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #aadaaa',
                        background: '#fff'
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell style={{ fontWeight: 600 }}>{hk.name}</CTableDataCell>
                  <CTableDataCell>
          {hk._id}
        </CTableDataCell>
                  <CTableDataCell>{hk.age}</CTableDataCell>
                  <CTableDataCell>{hk.experience} yrs</CTableDataCell>
                  <CTableDataCell>
                    {Array.isArray(hk.skills) ? hk.skills.join(', ') : ''}
                  </CTableDataCell>
                  <CTableDataCell>{hk.pricePerMeter ?? '-'}</CTableDataCell>
                  <CTableDataCell>
                    {Array.isArray(hk.availability) && hk.availability.length > 0 ? (
                      <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {hk.availability.map((a, idx) => (
                          <li key={idx} style={{ marginBottom: 2 }}>
                            <span style={{ color: "#aadaaa", fontWeight: 500 }}>{a.day || ''}</span>
                            {a.date ? <span style={{ color: "#aaa" }}> ({new Date(a.date).toLocaleDateString()})</span> : ''}
                            {': '}
                            <span style={{ color: "#fff" }}>
                              {Array.isArray(a.times) ? a.times.join(', ') : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      className="me-3"
                      style={{
                        backgroundColor: 'rgb(170, 218, 170)',
                        borderColor: 'rgb(170, 218, 170)',
                        color: '#222',
                        minWidth: 60,
                        fontWeight: 600,
                        borderRadius: 8
                      }}
                      onClick={() => handleEdit(hk)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      style={{ minWidth: 60, fontWeight: 600, borderRadius: 8 }}
                      onClick={() => handleDelete(hk._id)}
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
  );
}

export default Housekeepers;