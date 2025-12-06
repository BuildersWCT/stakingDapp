# 🔔 Notification System Documentation

A beautiful, animated notification system built with Framer Motion for the Crystal Stakes DApp.

## ✨ Features

- **🎬 Smooth Animations**: Slide-in from top with spring physics
- **✅ Animated Checkmarks**: Success messages feature drawing checkmark animations
- **🎨 Multiple Types**: Success, Error, Info, and Warning notifications
- **⏰ Auto-Dismiss**: Automatically disappear after 4 seconds (configurable)
- **♿ Accessibility**: Full ARIA support for screen readers
- **📱 Mobile Responsive**: Works perfectly on all device sizes
- **🎯 Global State**: Context-based notification management

## 🚀 Quick Start

### 1. Setup (Already Done)

The notification system is already integrated into the app:

```tsx
// App.tsx - Already wrapped with NotificationProvider
<NotificationProvider>
  <HomeContent />
</NotificationProvider>
```

### 2. Using Notifications in Components

```tsx
import { useNotification } from './NotificationProvider';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  const handleAction = async () => {
    try {
      await someAsyncAction();
      showSuccess('Success!', 'Action completed successfully!');
    } catch (error) {
      showError('Error!', error.message);
    }
  };

  return <button onClick={handleAction}>Do Action</button>;
}
```

## 📋 API Reference

### NotificationProvider

Wrapper component that provides notification context to the entire app.

```tsx
<NotificationProvider>
  <YourApp />
</NotificationProvider>
```

### useNotification Hook

Access notification methods in any component:

```tsx
const { 
  showSuccess,    // Show success notification
  showError,      // Show error notification
  showInfo,       // Show info notification
  showWarning,    // Show warning notification
  notifications,  // Array of current notifications
  dismissNotification // Function to manually dismiss notification
} = useNotification();
```

### Notification Methods

#### showSuccess(title, message?, duration?)
```tsx
showSuccess('Staking Successful!', 'You have successfully staked 100 HAPG tokens!', 5000);
```

#### showError(title, message?, duration?)
```tsx
showError('Transaction Failed', 'Insufficient gas fees', 6000); // Errors stay longer by default
```

#### showInfo(title, message?, duration?)
```tsx
showInfo('Processing', 'Your transaction is being confirmed');
```

#### showWarning(title, message?, duration?)
```tsx
showWarning('Warning', 'Please review transaction details');
```

## 🎨 Notification Types

### Success
- **Color**: Green theme
- **Icon**: Animated checkmark
- **Default Duration**: 4 seconds
- **Animation**: Slide-in + checkmark drawing effect

### Error  
- **Color**: Red theme
- **Icon**: X mark
- **Default Duration**: 6 seconds
- **Animation**: Slide-in + shake effect

### Info
- **Color**: Blue theme  
- **Icon**: Info circle
- **Default Duration**: 4 seconds
- **Animation**: Slide-in + bounce

### Warning
- **Color**: Yellow theme
- **Icon**: Warning triangle
- **Default Duration**: 5 seconds
- **Animation**: Slide-in + pulse

## 🎬 Animation Details

### Entrance Animation
- **From**: `-100px Y translation`, `0.8 scale`, `0 opacity`
- **To**: `0px Y translation`, `1 scale`, `1 opacity`
- **Duration**: 400ms
- **Easing**: `easeInOut` with spring physics
- **Stiffness**: 300
- **Damping**: 30

### Exit Animation
- **From**: Current state
- **To**: `-100px Y translation`, `0.8 scale`, `0 opacity`
- **Duration**: 300ms
- **Easing**: `easeInOut`

### Checkmark Animation (Success Only)
- **Path Length**: Animated from 0 to 1
- **Duration**: 600ms
- **Delay**: 200ms after entrance
- **Easing**: `easeInOut`

## 🔧 Customization

### Changing Default Durations

```tsx
// In NotificationProvider.tsx
const showSuccess = (title: string, message?: string, duration = 4000) => {
  addNotification({ type: 'success', title, message, duration });
};
```

### Custom Styling

Edit the notification styles in `NotificationToast.tsx`:

```tsx
const getBackgroundColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200'; // Customize here
    // ... other cases
  }
};
```

### Position

Notifications appear in the top-right corner by default. To change:

```tsx
// In NotificationContainer
<div className="fixed top-4 right-4 z-50">
  {/* Change 'top-4 right-4' to desired position */}
</div>
```

## 🧪 Testing

Use the `NotificationTest` component to test all notification types:

```tsx
import { NotificationTest } from './NotificationTest';

// Add to your component
<NotificationTest />
```

### Manual Testing Checklist

- [ ] Success notifications show animated checkmarks
- [ ] All notification types slide in smoothly
- [ ] Notifications auto-dismiss after duration
- [ ] Clicking close button dismisses immediately
- [ ] Multiple notifications stack properly
- [ ] Works on mobile devices
- [ ] Screen readers announce notifications

## ♿ Accessibility Features

- **ARIA Labels**: Proper `role="alert"` and `aria-live="polite"`
- **Focus Management**: Close buttons are focusable
- **Screen Reader Support**: All text is announced
- **Keyboard Navigation**: Tab navigation works
- **Color Contrast**: Meets WCAG guidelines

## 🏗️ Component Architecture

```
NotificationProvider (Context)
├── NotificationContainer (Container)
│   ├── NotificationToast 1
│   ├── NotificationToast 2
│   └── ...
└── Individual Toast Components
    ├── Animated Icons
    ├── Content Areas
    └── Close Buttons
```

## 📁 File Structure

```
src/
├── components/
│   ├── NotificationProvider.tsx    # Context provider
│   ├── ui/
│   │   └── NotificationToast.tsx   # Toast component
│   ├── NotificationTest.tsx        # Test component
│   └── NOTIFICATIONS.md           # This documentation
```

## 🔮 Future Enhancements

- [ ] Progress notifications for long operations
- [ ] Persistent notifications that require user action
- [ ] Custom sound effects
- [ ] Notification history
- [ ] Rich content support (links, images)
- [ ] Batch notifications
- [ ] Custom animation themes

## 🐛 Troubleshooting

### Notifications Not Showing
1. Check that `NotificationProvider` wraps your app
2. Ensure components are inside the provider
3. Verify Framer Motion is installed: `npm install framer-motion`

### Animations Not Smooth
1. Check browser performance settings
2. Reduce animation duration if needed
3. Test on different devices

### Accessibility Issues
1. Verify ARIA labels are present
2. Test with screen reader
3. Check color contrast ratios

## 📚 Dependencies

- **React**: 19.1.1+
- **Framer Motion**: Latest version
- **TypeScript**: 5.8.3+

---

Built with ❤️ for the Crystal Stakes DApp