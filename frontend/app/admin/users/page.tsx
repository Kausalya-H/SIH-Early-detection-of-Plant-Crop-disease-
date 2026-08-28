'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  RoleBadge,
  StatusBadge,
  Badge,
} from '@/components/shared';

import { UsersIcon } from '@/components/shared/ui/Icons';
import { MOCK_SYSTEM_USERS } from '@/lib/mock';
import { formatDate } from '@/lib/utils';
import { SystemUser } from '@/types';

const emptyUser: Omit<SystemUser, 'id' | 'createdAt' | 'lastActive'> = {
  name: '',
  email: '',
  phone: '',
  role: 'OFFICER',
  designation: '',
  department: '',
  state: '',
  district: '',
  status: 'ACTIVE',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | 'VIEW'>('ADD');

  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  const [form, setForm] =
    useState<Omit<SystemUser, 'id' | 'createdAt' | 'lastActive'>>(
      emptyUser
    );

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.state.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === 'ALL' || user.role === roleFilter;

      const matchesStatus =
        statusFilter === 'ALL' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openAddModal = () => {
    setModalMode('ADD');
    setSelectedUser(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openViewModal = (user: SystemUser) => {
    setModalMode('VIEW');
    setSelectedUser(user);
    setShowModal(true);
  };

  const openEditModal = (user: SystemUser) => {
    setModalMode('EDIT');
    setSelectedUser(user);

    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      designation: user.designation,
      department: user.department,
      state: user.state,
      district: user.district || '',
      status: user.status,
    });

    setShowModal(true);
  };

  const handleSaveUser = () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email are required.');
      return;
    }

    if (modalMode === 'ADD') {
      const newUser: SystemUser = {
        ...form,
        id: `usr-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      setUsers((current) => [...current, newUser]);
    }

    if (modalMode === 'EDIT' && selectedUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...form,
              }
            : user
        )
      );
    }

    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === 'ACTIVE'
                  ? 'INACTIVE'
                  : 'ACTIVE',
            }
          : user
      )
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="space-y-1">

          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-purple-400" />

            <h2 className="text-base font-bold tracking-tight">
              User Access Provisioning & RBAC Role Management
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Manage administrative credentials, district agricultural officer
            provisioning, field worker role assignments, and single sign-on
            (SSO) governance.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <Badge variant="primary" size="sm">
            {users.length} Registered Accounts
          </Badge>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-md bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100"
          >
            + Add User
          </button>

        </div>

      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Search name, email, state, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="OFFICER">Agriculture Officer</option>
              <option value="FARMER">Farmer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Clear
            </button>

          </div>

          <div className="mt-3 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} accounts
          </div>

        </CardContent>
      </Card>

      {/* Table */}
      <Card>

        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              NIC SSO Directory Synced
            </span>
          }
        >
          <CardTitle>
            System Accounts & Agricultural Officers
          </CardTitle>

          <CardDescription>
            Active user permissions across central directorates and state
            departments of agriculture.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>User Name & Email</TableHead>
                <TableHead>Designation & Department</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {filteredUsers.length === 0 ? (

                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="py-8 text-center text-sm text-slate-500">
                      No users found.
                    </div>
                  </TableCell>
                </TableRow>

              ) : (

                filteredUsers.map((user) => (

                  <TableRow key={user.id}>

                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">
                        {user.name}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        {user.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-800">
                        {user.designation}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        {user.department}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-800">
                        {user.state}
                      </div>

                      {user.district && (
                        <div className="text-[11px] text-slate-500">
                          {user.district} District
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(user.lastActive)}
                    </TableCell>

                    <TableCell>

                      <div className="flex flex-wrap gap-2">

                        <button
                          type="button"
                          onClick={() => openViewModal(user)}
                          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(user.id)}
                          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100"
                        >
                          {user.status === 'ACTIVE'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>

                      </div>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      {/* Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalMode === 'ADD'
                    ? 'Add New User'
                    : modalMode === 'EDIT'
                    ? 'Edit User'
                    : 'User Details'}
                </h3>

                <p className="text-xs text-slate-500">
                  {modalMode === 'VIEW'
                    ? 'View account information'
                    : 'Manage system account information'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-900 text-xl"
              >
                ×
              </button>

            </div>

            {modalMode === 'VIEW' && selectedUser ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">

                <Info label="Name" value={selectedUser.name} />
                <Info label="Email" value={selectedUser.email} />
                <Info label="Phone" value={selectedUser.phone} />
                <Info label="Role" value={selectedUser.role} />
                <Info label="Designation" value={selectedUser.designation} />
                <Info label="Department" value={selectedUser.department} />
                <Info label="State" value={selectedUser.state} />
                <Info label="District" value={selectedUser.district || '—'} />
                <Info label="Status" value={selectedUser.status} />
                <Info
                  label="Created"
                  value={formatDate(selectedUser.createdAt)}
                />

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">

                <Field
                  label="Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                />

                <Field
                  label="Email"
                  value={form.email}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      email: value,
                    }))
                  }
                />

                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      phone: value,
                    }))
                  }
                />

                <Field
                  label="Designation"
                  value={form.designation}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      designation: value,
                    }))
                  }
                />

                <Field
                  label="Department"
                  value={form.department}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      department: value,
                    }))
                  }
                />

                <Field
                  label="State"
                  value={form.state}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      state: value,
                    }))
                  }
                />

                <Field
                  label="District"
                  value={form.district || ''}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      district: value,
                    }))
                  }
                />

                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">
                    Role
                  </span>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        role: e.target.value as SystemUser['role'],
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="OFFICER">Agriculture Officer</option>
                    <option value="FARMER">Farmer</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">
                    Status
                  </span>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        status: e.target.value as SystemUser['status'],
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </label>

              </div>

            )}

            <div className="flex justify-end gap-3 border-t px-6 py-4">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Close
              </button>

              {modalMode !== 'VIEW' && (
                <button
                  type="button"
                  onClick={handleSaveUser}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {modalMode === 'ADD'
                    ? 'Create User'
                    : 'Save Changes'}
                </button>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* Small reusable components */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold text-slate-700">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
      />
    </label>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase text-slate-500">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-900">
        {value}
      </div>
    </div>
  );
}