import React, { useState } from 'react';
import { mockUsers } from '../../data/mockData';
import AddEmployeePage from './AddEmployeePage';
import './UserManagement.css';

/**
 * UserManagement Component - إدارة المستخدمين المحدثة
 * Features:
 * - نظام صلاحيات متقدم (Admin/Manager)
 * - تبويبات لعرض المستخدمين وإضافة موظفين
 * - تصميم عصري مع أنيميشن
 * - ألوان متناسقة وحديثة
 */
const UserManagement = ({ user }) => {
  const [users, setUsers] = useState(mockUsers);
  const [activeTab, setActiveTab] = useState('users-list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [meetingUser, setMeetingUser] = useState(null);

  // تحديد الأدوار المتاحة حسب دور المستخدم الحالي
  const getAvailableRoles = () => {
    if (user?.role === 'admin') {
      return [
        { value: 'employee', label: 'Employee' },
        { value: 'manager', label: 'Manager' },
        { value: 'admin', label: 'Admin' }
      ];
    } else if (user?.role === 'manager') {
      return [
        { value: 'employee', label: 'Employee' }
      ];
    }
    return [];
  };

  // فلترة المستخدمين حسب الصلاحيات
  const getFilteredUsers = () => {
    let filtered = users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // إذا كان مدير، يرى فقط الموظفين
    if (user?.role === 'manager') {
      filtered = filtered.filter(u => u.role === 'employee');
    }

    return filtered;
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  const filteredUsers = getFilteredUsers();
  const availableRoles = getAvailableRoles();

  return (
    <div className="user-management">
      {/* Header عصري */}
      <div className="page-header">
        <h1 className="page-title">👥 User Management</h1>
        <p className="page-subtitle">Manage users with modern design</p>
      </div>

      {/* تبويبات عصرية */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'users-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('users-list')}
        >
          📋 Users List
        </button>
        <button 
          className={`tab-button ${activeTab === 'add-employee' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-employee')}
        >
          ➕ Add User
        </button>
      </div>

      {activeTab === 'users-list' ? (
        <div className="users-list-tab">
          {/* بحث مدمج */}
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* احصائيات سريعة */}
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{filteredUsers.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>

          {/* شبكة المستخدمين */}
          <div className="users-grid">
            {filteredUsers.map((userItem, index) => (
              <UserCard
                key={userItem.id}
                user={userItem}
                index={index}
                onEdit={() => setEditingUser(userItem)}
                onDelete={() => handleDelete(userItem.id)}
                onMeeting={() => setMeetingUser(userItem)}
                currentUserRole={user?.role}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="add-employee-tab">
          <AddEmployeePage user={user} availableRoles={availableRoles} />
        </div>
      )}

      {/* Modal التعديل */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>✏️ Edit User</h3>
              <button className="modal-close" onClick={() => setEditingUser(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="form-select"
                >
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSaveEdit} className="btn-primary">💾 Save</button>
              <button onClick={() => setEditingUser(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal الاجتماع */}
      {meetingUser && (
        <ScheduleMeetingModal
          employee={meetingUser}
          onClose={() => setMeetingUser(null)}
        />
      )}
    </div>
  );
};

// مكون البطاقة العصري
const UserCard = ({ user, index, onEdit, onDelete, onMeeting, currentUserRole }) => {
  const roleColors = {
    employee: { bg: '#10b981', text: '#065f46' },
    manager: { bg: '#3b82f6', text: '#1e40af' },
    admin: { bg: '#8b5cf6', text: '#5b21b6' }
  };

  const roleConfig = roleColors[user.role] || roleColors.employee;

  // تحديد إمكانية التعديل
  const canModify = () => {
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'manager' && user.role === 'employee') return true;
    return false;
  };

  return (
    <div
      className="user-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="user-avatar" style={{ backgroundColor: roleConfig.bg }}>
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="user-info">
        <h4 className="user-name">{user.name}</h4>
        <p className="user-email">{user.email}</p>
        <span 
          className="role-badge" 
          style={{ backgroundColor: `${roleConfig.bg}15`, color: roleConfig.text }}
        >
          {user.role.toUpperCase()}
        </span>
      </div>

      <div className="user-actions">
        {canModify() && (
          <>
            <button onClick={onEdit} className="action-btn edit" title="Edit">
              ✏️
            </button>
            <button onClick={onDelete} className="action-btn delete" title="Delete">
              🗑️
            </button>
          </>
        )}
        <button onClick={onMeeting} className="action-btn meeting" title="Meeting">
          📅
        </button>
      </div>
    </div>
  );
};

// Modal الاجتماع
const ScheduleMeetingModal = ({ employee, onClose }) => {
  const [meetingType, setMeetingType] = useState('Standup');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    if (!date || !time) {
      alert('Please select date and time');
      return;
    }
    alert(`✅ Meeting with ${employee.name} scheduled!`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>📅 Schedule Meeting</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Meeting Type</label>
            <select 
              value={meetingType} 
              onChange={(e) => setMeetingType(e.target.value)}
              className="form-select"
            >
              <option>Standup</option>
              <option>Review</option>
              <option>One-on-One</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSave} className="btn-primary">📅 Schedule</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;