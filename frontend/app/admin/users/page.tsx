import React from 'react';
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

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-tight">
              User Access Provisioning & RBAC Role Management
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Manage administrative credentials, district agricultural officer provisioning, field worker role assignments, and single sign-on (SSO) governance.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          {MOCK_SYSTEM_USERS.length} Registered Accounts
        </Badge>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              NIC SSO Directory Synced
            </span>
          }
        >
          <CardTitle>System Accounts & Agricultural Officers</CardTitle>
          <CardDescription>
            Active user permissions across central directorates and state departments of agriculture.
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SYSTEM_USERS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-slate-800">{user.designation}</div>
                    <div className="text-[11px] text-slate-500">{user.department}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-slate-800">{user.state}</div>
                    {user.district && (
                      <div className="text-[11px] text-slate-500">{user.district} District</div>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
