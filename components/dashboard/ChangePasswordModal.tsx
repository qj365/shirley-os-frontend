'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/lib/validations/schemas';
import { getPasswordStrength } from '@/services/auth-service';
import { api } from '@/src/lib/api/customer';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordStrengthIndicator from '../auth/PasswordStrengthIndicator';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form instance
  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(
      changePasswordSchema
    ) as unknown as Resolver<ChangePasswordFormData>,
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Password strength validation
  const newPassword = changePasswordForm.watch('newPassword');
  const passwordStrength = getPasswordStrength(newPassword || '');

  const handleSubmit = async (data: ChangePasswordFormData) => {
    setError('');
    setSuccessMessage('');

    if (!passwordStrength.is_strong) {
      setError('Please use a stronger password');
      return;
    }

    setLoading(true);

    try {
      await api.auth.changePassword({
        requestBody: {
          password: data.newPassword,
        },
      });

      setSuccessMessage('Password changed successfully!');

      // Reset form
      changePasswordForm.reset();

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Change password error:', err);
      setError(err?.details || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccessMessage('');
    changePasswordForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Change Password
          </DialogTitle>
        </DialogHeader>

        {/* Error/Success Messages */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {successMessage && (
          <p className="mb-4 text-sm text-green-500">{successMessage}</p>
        )}

        {/* Form */}
        <form
          onSubmit={changePasswordForm.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                {...changePasswordForm.register('newPassword')}
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 text-gray-500 focus:outline-none"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {changePasswordForm.formState.errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {changePasswordForm.formState.errors.newPassword.message}
              </p>
            )}
            {newPassword && (
              <PasswordStrengthIndicator
                passwordStrength={passwordStrength}
                password={newPassword}
              />
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <input
                {...changePasswordForm.register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-gray-500 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {changePasswordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {changePasswordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
