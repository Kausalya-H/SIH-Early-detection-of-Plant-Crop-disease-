'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  Button,
} from '@/components/shared';

import { UsersIcon } from '@/components/shared/ui/Icons';
import { SystemUser } from '@/types';
import {
  getAdminUsers,
  updateAdminUserStatus,
} from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load users';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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
        roleFilter === 'ALL' ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const toggleStatus = async (user: SystemUser) => {
    const newStatus =
      user.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE';

    try {
      setUpdatingUserId(user.id);
      setError('');

      await updateAdminUserStatus(
        user.id,
        newStatus
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status: newStatus,
              }
            : currentUser
        )
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to update user status';

      setError(message);
    } finally {
      setUpdatingUserId(null);
    }
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

        <Badge variant="primary" size="sm">
          {users.length} Registered Accounts
        </Badge>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>

        <CardContent className="p-4">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Search name, email, state, department..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">
                All Roles
              </option>

              <option value="ADMIN">
                Admin
              </option>

              <option value="OFFICER">
                Agriculture Officer
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="SUSPENDED">
                Suspended
              </option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              Clear
            </Button>

          </div>

          <div className="mt-3 text-xs text-slate-500">
            {loading
              ? 'Loading users...'
              : `Showing ${filteredUsers.length} of ${users.length} accounts`}
          </div>

        </CardContent>

      </Card>

      {/* Users Table */}
      <Card>

        <CardHeader
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
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

                <TableHead>
                  User Name & Email
                </TableHead>

                <TableHead>
                  Designation & Department
                </TableHead>

                <TableHead>
                  Jurisdiction
                </TableHead>

                <TableHead>
                  Role
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Last Active
                </TableHead>

                <TableHead>
                  Action
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {loading ? (

                <TableRow>

                  <TableCell colSpan={7}>

                    <div className="py-8 text-center text-sm text-slate-500">
                      Loading users from backend...
                    </div>

                  </TableCell>

                </TableRow>

              ) : filteredUsers.length === 0 ? (

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
                      {new Date(user.lastActive).toLocaleString()}
                    </TableCell>

                    <TableCell>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          updatingUserId === user.id
                        }
                        onClick={() =>
                          toggleStatus(user)
                        }
                      >
                        {updatingUserId === user.id
                          ? 'Updating...'
                          : user.status === 'ACTIVE'
                            ? 'Deactivate'
                            : 'Activate'}
                      </Button>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  );
}