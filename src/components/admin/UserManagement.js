import React, { useState } from 'react';
import AddEmployeePage from './AddEmployeePage';
import './UserManagement.css';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [showModal, setShowModal] = useState(false);

  // Current user role (this would come from auth context in real app)
  const currentUserRole = 'admin'; // Can be 'admin', 'manager', 'employee'

  // Mock users data
  const mockUsers = [
    { id: 1, name: 'أحمد محمد', role: 'admin', department: 'IT', position: 'مدير تقني', email: 'ahmed@company.com', joinDate: '2023-01-15' },
    { id: 2, name: 'فاطمة أحمد', role: 'manager', department: 'HR', position: 'مدير موارد بشرية', email: 'fatima@company.com', joinDate: '2023-02-20' },
    { id: 3, name: 'محمد علي', role: 'employee', department: 'Sales', position: 'مندوب مبيعات', email: 'mohamed@company.com', joinDate: '2023-03-10' },
    { id: 4, name: 'سارة خالد', role: 'employee', department: 'Marketing', position: 'مسوق رقمي', email: 'sara@company.com', joinDate: '2023-04-05' },
    { id: 5, name: 'عبدالله حسن', role: 'manager', department: 'Finance', position: 'مدير مالي', email: 'abdullah@company.com', joinDate: '2023-05-12' }
  ];

  // Get available roles based on current user's permissions
  const getAvailableRoles = () => {
    if (currentUserRole === 'admin') {
      return [
        { value: 'employee', label: 'Employee' },
        { value: 'manager', label: 'Manager' },
        { value: 'admin', label: 'Admin' }
      ];
    } else if (currentUserRole === 'manager') {
      return [
        { value: 'employee', label: 'Employee' }
      ];
    }
    return [];
  };

  // Filter users based on permissions
  const getFilteredUsers = () => {
    if (currentUserRole === 'admin') {
      return mockUsers; // Admin can see all users
    } else if (currentUserRole === 'manager') {
      return mockUsers.filter(user => user.role === 'employee'); // Manager can only see employees
    }
    return []; // Employees can't manage users
  };

  // User Card Component
  const UserCard = ({ user }) => (
    <div className="user-card">
      <div className="user-avatar">
        <div className="avatar-circle">
          {user.name.charAt(0)}
        </div>
      </div>
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-role">{user.role}</p>
        <p className="user-department">{user.department}</p>
        <p className="user-position">{user.position}</p>
        <p className="user-email">{user.email}</p>
        <p className="user-join-date">تاريخ الانضمام: {user.joinDate}</p>
      </div>
      <div className="user-actions">
        {(currentUserRole === 'admin' || (currentUserRole === 'manager' && user.role === 'employee')) && (
          <>
            <button className="btn-edit">تعديل</button>
            <button className="btn-delete">حذف</button>
          </>
        )}
        <button 
          className="btn-schedule"
          onClick={() => setShowModal(true)}
        >
          جدولة اجتماع
        </button>
      </div>
    </div>
  );

  // Schedule Meeting Modal
  const ScheduleMeetingModal = () => (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>جدولة اجتماع جديد</h3>
          <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>عنوان الاجتماع</label>
            <input type="text" className="form-input" placeholder="أدخل عنوان الاجتماع" />
          </div>
          <div className="form-group">
            <label>التاريخ</label>
            <input type="date" className="form-input" />
          </div>
          <div className="form-group">
            <label>الوقت</label>
            <input type="time" className="form-input" />
          </div>
          <div className="form-group">
            <label>المدة (بالدقائق)</label>
            <input type="number" className="form-input" placeholder="60" />
          </div>
          <div className="form-group">
            <label>الوصف</label>
            <textarea className="form-textarea" rows="3" placeholder="وصف الاجتماع..."></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => setShowModal(false)}>إلغاء</button>
          <button className="btn-confirm" onClick={() => setShowModal(false)}>حفظ الاجتماع</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-management">
      <div className="management-header">
        <h1 className="page-title">إدارة المستخدمين</h1>
        <p className="page-subtitle">إدارة شاملة للموظفين والأذونات</p>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            <span className="tab-icon">👥</span>
            إدارة المستخدمين
          </button>
          {(currentUserRole === 'admin' || currentUserRole === 'manager') && (
            <button 
              className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              <span className="tab-icon">➕</span>
              إضافة موظف
            </button>
          )}
          <button 
            className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <span className="tab-icon">🔐</span>
            الأذونات والأدوار
          </button>
          <button 
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="tab-icon">📊</span>
            التقارير
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'manage' && (
            <div className="manage-tab">
              <div className="tab-header">
                <div className="header-info">
                  <h2>قائمة المستخدمين</h2>
                  <p>المجموع: {getFilteredUsers().length} مستخدم</p>
                </div>
                {(currentUserRole === 'admin' || currentUserRole === 'manager') && (
                  <button className="btn-add-user" onClick={() => setActiveTab('add')}>
                    <span className="btn-icon">➕</span>
                    إضافة موظف جديد
                  </button>
                )}
              </div>

              <div className="filters-section">
                <div className="search-box">
                  <input 
                    type="text" 
                    placeholder="البحث عن مستخدم..." 
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <select className="filter-select">
                  <option value="">جميع الأقسام</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
                <select className="filter-select">
                  <option value="">جميع الأدوار</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="users-grid">
                {getFilteredUsers().map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="add-employee-tab">
              <AddEmployeePage 
                availableRoles={getAvailableRoles()}
              />
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="roles-tab">
              <div className="tab-header">
                <h2>إدارة الأذونات والأدوار</h2>
                <p>تحديد صلاحيات كل دور في النظام</p>
              </div>

              <div className="roles-grid">
                <div className="role-card admin-role">
                  <div className="role-header">
                    <span className="role-icon">👑</span>
                    <h3>مدير النظام (Admin)</h3>
                  </div>
                  <div className="role-permissions">
                    <div className="permission-item">✅ إضافة جميع أنواع المستخدمين</div>
                    <div className="permission-item">✅ تعديل وحذف المستخدمين</div>
                    <div className="permission-item">✅ عرض جميع التقارير</div>
                    <div className="permission-item">✅ إدارة إعدادات النظام</div>
                    <div className="permission-item">✅ الوصول الكامل لجميع الميزات</div>
                  </div>
                </div>

                <div className="role-card manager-role">
                  <div className="role-header">
                    <span className="role-icon">👨‍💼</span>
                    <h3>مدير (Manager)</h3>
                  </div>
                  <div className="role-permissions">
                    <div className="permission-item">✅ إضافة موظفين فقط</div>
                    <div className="permission-item">✅ تعديل بيانات الموظفين</div>
                    <div className="permission-item">✅ عرض تقارير القسم</div>
                    <div className="permission-item">❌ لا يمكن إضافة مديرين أو أدمن</div>
                    <div className="permission-item">❌ لا يمكن الوصول لإعدادات النظام</div>
                  </div>
                </div>

                <div className="role-card employee-role">
                  <div className="role-header">
                    <span className="role-icon">👤</span>
                    <h3>موظف (Employee)</h3>
                  </div>
                  <div className="role-permissions">
                    <div className="permission-item">✅ عرض البيانات الشخصية</div>
                    <div className="permission-item">✅ تحديث البيانات الشخصية</div>
                    <div className="permission-item">✅ طلب الإجازات</div>
                    <div className="permission-item">❌ لا يمكن إدارة المستخدمين</div>
                    <div className="permission-item">❌ لا يمكن الوصول للتقارير الإدارية</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-tab">
              <div className="tab-header">
                <h2>التقارير والإحصائيات</h2>
                <p>مراقبة أداء النظام والمستخدمين</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{mockUsers.length}</div>
                  <div className="stat-label">إجمالي المستخدمين</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👑</div>
                  <div className="stat-value">{mockUsers.filter(u => u.role === 'admin').length}</div>
                  <div className="stat-label">مديري النظام</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👨‍💼</div>
                  <div className="stat-value">{mockUsers.filter(u => u.role === 'manager').length}</div>
                  <div className="stat-label">المديرين</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👤</div>
                  <div className="stat-value">{mockUsers.filter(u => u.role === 'employee').length}</div>
                  <div className="stat-label">الموظفين</div>
                </div>
              </div>

              <div className="charts-section">
                <div className="chart-card">
                  <h3>توزيع المستخدمين حسب القسم</h3>
                  <div className="chart-placeholder">
                    📊 مخطط دائري يوضح توزيع الموظفين على الأقسام
                  </div>
                </div>
                <div className="chart-card">
                  <h3>نمو عدد المستخدمين</h3>
                  <div className="chart-placeholder">
                    📈 مخطط خطي يوضح نمو عدد المستخدمين خلال الأشهر
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && <ScheduleMeetingModal />}
    </div>
  );
};

export default UserManagement;