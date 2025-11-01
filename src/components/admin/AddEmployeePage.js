import React, { useState } from 'react';
import './AddEmployeePage.css';

const AddEmployeePage = ({ user, availableRoles }) => {
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    department: '',
    position: '',
    role: availableRoles && availableRoles.length > 0 ? availableRoles[0].value : 'employee',
    startDate: '',
    annualSalary: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    skills: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // الاسم يجب أن يكون إنجليزي فقط وبدون أرقام
    if (!formData.firstName.trim() || !/^[A-Za-z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = '⚠️ First name must contain English letters only (No numbers).';
    }

    if (!formData.lastName.trim() || !/^[A-Za-z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = '⚠️ Last name must contain English letters only (No numbers).';
    }

    // الإيميل يجب أن ينتهي بـ .com
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/.test(formData.email)) {
      newErrors.email = '⚠️ Email must be valid and end with .com';
    }

    // رقم الهاتف يجب أن يبدأ بـ 07 ويكون 10 أرقام
    if (formData.phoneNumber && !/^07\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '⚠️ Phone number must start with 07 and be 10 digits.';
    }

    // حقول مطلوبة
    if (!formData.department) newErrors.department = '⚠️ Department is required';
    if (!formData.position.trim()) newErrors.position = '⚠️ Position is required';
    if (!formData.role) newErrors.role = '⚠️ Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsEditing(false);
      alert("✅ Employee saved successfully! (Fields are now locked)");
    }
  };

  const handleEdit = () => setIsEditing(true);

  const addSkill = (skill) => {
    if (!isEditing) return;
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const resetForm = () => {
    if (!isEditing) return;
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
      department: '',
      position: '',
      startDate: '',
      annualSalary: '',
      phoneNumber: '',
      address: '',
      emergencyContact: '',
      skills: [],
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="add-employee-page">
      <div className="page-header">
        <h1 className="page-title">Add New Employee</h1>
        <p className="page-subtitle">Create a new employee account and profile</p>
      </div>

      <div className="employee-form-container">
        <form onSubmit={handleSubmit} className="employee-form">
          
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Job Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-select ${errors.department ? 'error' : ''}`}
                >
                  <option value="">Select...</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label>Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-input ${errors.position ? 'error' : ''}`}
                />
                {errors.position && <span className="error-message">{errors.position}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`form-select ${errors.role ? 'error' : ''}`}
                >
                  {availableRoles && availableRoles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            {isEditing ? (
              <>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Reset</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit ✏️
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;
