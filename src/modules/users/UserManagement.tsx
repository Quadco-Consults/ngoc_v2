import { useState } from 'react';
import { Plus, Download, Upload, Mail, Phone, Shield } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import SearchAndFilter from '../../components/shared/SearchAndFilter';
import TableComponent from '../../components/shared/TableComponent';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import StatsCard from '../../components/shared/StatsCard';
import { InputField, SelectField } from '../../components/shared/FormField';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Operator' | 'Viewer';
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  createdAt: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Adebayo Johnson',
    email: 'adebayo.johnson@nnpc.com',
    phone: '+234 803 123 4567',
    role: 'Admin',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2024-01-21T10:30:00',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Chioma Okonkwo',
    email: 'chioma.okonkwo@nnpc.com',
    phone: '+234 805 234 5678',
    role: 'Manager',
    department: 'Production',
    status: 'Active',
    lastLogin: '2024-01-21T09:15:00',
    createdAt: '2023-03-20',
  },
  {
    id: '3',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@nnpc.com',
    phone: '+234 807 345 6789',
    role: 'Operator',
    department: 'Commercial',
    status: 'Active',
    lastLogin: '2024-01-20T16:45:00',
    createdAt: '2023-06-10',
  },
  {
    id: '4',
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@nnpc.com',
    phone: '+234 809 456 7890',
    role: 'Viewer',
    department: 'Analytics',
    status: 'Inactive',
    lastLogin: '2024-01-10T14:20:00',
    createdAt: '2023-08-05',
  },
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const itemsPerPage = 10;
  const filteredData = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCount = mockUsers.filter((u) => u.status === 'Active').length;
  const adminCount = mockUsers.filter((u) => u.role === 'Admin').length;

  const handleAdd = () => {
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit user:', formData);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    console.log('Delete user:', selectedUser);
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof User,
      render: (value: string, row: User) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <div className="flex items-center gap-2 mt-1">
            <Mail className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone' as keyof User,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department' as keyof User,
    },
    {
      header: 'Role',
      accessor: 'role' as keyof User,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3 text-gray-400" />
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              value === 'Admin'
                ? 'bg-purple-100 text-purple-700'
                : value === 'Manager'
                ? 'bg-blue-100 text-blue-700'
                : value === 'Operator'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin' as keyof User,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof User,
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === 'Active'
              ? 'bg-green-100 text-green-700'
              : value === 'Inactive'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage system users, roles, and permissions"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd}>
              Add User
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={mockUsers.length}
          color="primary"
        />
        <StatsCard
          title="Active Users"
          value={activeCount}
          color="success"
        />
        <StatsCard
          title="Administrators"
          value={adminCount}
          icon={<Shield className="w-6 h-6" />}
          color="accent"
        />
        <StatsCard
          title="New This Month"
          value="2"
          color="secondary"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by name, email, or department..."
        />
      </div>

      {/* Table */}
      <TableComponent
        data={paginatedData}
        columns={columns}
        actions={[
          { label: 'View Details', onClick: (row) => console.log('View', row), variant: 'primary' },
          { label: 'Edit', onClick: handleEdit, variant: 'outline' },
          { label: 'Delete', onClick: handleDelete, variant: 'danger' },
        ]}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              label="Email"
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <InputField
              label="Phone"
              type="tel"
              required
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <InputField
              label="Department"
              required
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <SelectField
              label="Role"
              required
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              options={[
                { value: 'Admin', label: 'Administrator' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Operator', label: 'Operator' },
                { value: 'Viewer', label: 'Viewer' },
              ]}
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              label="Email"
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <InputField
              label="Phone"
              type="tel"
              required
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <InputField
              label="Department"
              required
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <SelectField
              label="Role"
              required
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              options={[
                { value: 'Admin', label: 'Administrator' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Operator', label: 'Operator' },
                { value: 'Viewer', label: 'Viewer' },
              ]}
            />
            <SelectField
              label="Status"
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Suspended', label: 'Suspended' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone and will revoke all access permissions.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
