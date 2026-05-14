'use client';

import { useAuth } from '@/lib/auth-context';
import { User, Mail, Calendar, Settings as SettingsIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-8">
        <p className="text-red-600">Unable to load user information.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-700" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Account Information</h2>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium">
                {user.email}
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                User ID
              </label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono text-sm break-all">
                {user.id}
              </div>
            </div>

            {/* Member Since */}
            {user.created_at && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                  {format(new Date(user.created_at), 'MMMM dd, yyyy')}
                </div>
              </div>
            )}

            {/* Account Status */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-emerald-700 font-medium">
                Account is active and verified
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections (Future Expansion) */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Preferences</h2>
          <div className="text-slate-500 italic text-center py-8 border border-dashed border-slate-300 rounded-xl">
            Additional settings (theme, notifications, AI preferences, etc.) will go here.
            <br />
            Would you like me to implement these?
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow border border-red-200 p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
          <button className="text-red-600 hover:bg-red-50 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-medium transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}