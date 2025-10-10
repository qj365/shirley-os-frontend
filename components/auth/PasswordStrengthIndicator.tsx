import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordStrengthResult } from '@/services/api-service';

interface PasswordStrengthIndicatorProps {
  passwordStrength: PasswordStrengthResult;
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  passwordStrength, 
  password 
}) => {
  if (!password) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Strong':
        return 'text-green-600';
      case 'Strong':
        return 'text-green-500';
      case 'Moderate':
        return 'text-yellow-500';
      case 'Weak':
        return 'text-orange-500';
      case 'Very Weak':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-green-600';
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressBarBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    if (score >= 30) return 'bg-orange-100';
    return 'bg-red-100';
  };

  // Define the criteria with their validation logic
  const criteria = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8
    },
    {
      text: 'Include lowercase letters',
      met: /[a-z]/.test(password)
    },
    {
      text: 'Include uppercase letters',
      met: /[A-Z]/.test(password)
    },
    {
      text: 'Include numbers',
      met: /\d/.test(password)
    },
    {
      text: 'Include special characters',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength indicator */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Password strength:</span>
          <span className={`text-xs font-medium ${getStrengthColor(passwordStrength.strength)}`}>
            {passwordStrength.strength}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className={`w-full h-2 rounded-full ${getProgressBarBgColor(passwordStrength.score)}`}>
          <div 
            className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor(passwordStrength.score)}`}
            style={{ width: `${passwordStrength.score}%` }}
          />
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="space-y-1">
        <span className="text-xs text-gray-600">Password requirements:</span>
        <div className="grid grid-cols-1 gap-1">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center space-x-2">
              {criterion.met ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
              <span className={`text-xs ${criterion.met ? 'text-green-600' : 'text-gray-500'}`}>
                {criterion.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
