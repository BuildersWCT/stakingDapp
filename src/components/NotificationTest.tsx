import React from 'react';
import { useNotification } from './NotificationProvider';

export const NotificationTest: React.FC = () => {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  const triggerNotifications = () => {
    // Test all notification types
    showSuccess('Success!', 'This is a success message with checkmark animation.');
    setTimeout(() => showError('Error!', 'This is an error message with shake animation.'), 1000);
    setTimeout(() => showInfo('Info', 'This is an informational message.'), 2000);
    setTimeout(() => showWarning('Warning', 'This is a warning message.'), 3000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 mb-8">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: 'serif' }}>
            Test Notifications
          </h3>
          <p className="text-sm text-gray-500">Test the notification animation system</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={triggerNotifications}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg"
        >
          🎉 Trigger All Notification Animations
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => showSuccess('Success!', 'Stake successful! Your tokens are now locked.')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
          >
            ✅ Success
          </button>
          <button
            onClick={() => showError('Error!', 'Transaction failed. Please try again.')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
          >
            ❌ Error
          </button>
          <button
            onClick={() => showInfo('Info', 'Your transaction is being processed.')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
          >
            ℹ️ Info
          </button>
          <button
            onClick={() => showWarning('Warning', 'Please review your transaction details.')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
          >
            ⚠️ Warning
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <h4 className="font-semibold mb-2">✨ Features:</h4>
          <ul className="space-y-1">
            <li>• Slide-in animations from top</li>
            <li>• Animated checkmarks for success</li>
            <li>• Auto-dismiss after 4 seconds</li>
            <li>• Spring physics animations</li>
            <li>• Accessible with ARIA labels</li>
            <li>• Mobile-responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};