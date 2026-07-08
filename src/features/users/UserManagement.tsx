import React, { useState } from 'react';
import { useAppState } from '@/context/AppStateContext';
import { ShieldCheck, Search, Users, ShieldAlert, Calendar } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { systemUsers, auditLogs } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Users & Security Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Review admissions workspace administrators and security audit records</p>
      </div>

      {/* Grid: Upper panel users; Lower panel logs */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* User list */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-slate-450" />
            Registered Workspace Users
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systemUsers.map(user => (
              <div key={user.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex gap-3.5 items-center">
                <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                <div className="truncate">
                  <span className="font-semibold text-slate-800 text-xs block truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[9px] font-bold capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit logs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-slate-450" />
              Security Audit Activity History
            </h3>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit parameters..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200/80 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="p-4">Action</th>
                  <th className="p-4">Log Details</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">No audit records found.</td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/20 text-slate-650">
                      <td className="p-4 font-bold text-slate-800">{log.action}</td>
                      <td className="p-4">{log.details}</td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 block">{log.userName}</span>
                        <span className="text-[9px] text-slate-450 font-bold block uppercase">{log.role}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-450">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
