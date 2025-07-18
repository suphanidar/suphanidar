import React from ‘react’;
import ReactDOM from ‘react-dom/client’;
import ‘./styles/index.css’;
import App from ‘./App’;
import reportWebVitals from ‘./reportWebVitals’;

// Error boundary component
class ErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = { hasError: false, error: null, errorInfo: null };
}

static getDerivedStateFromError(error) {
return { hasError: true };
}

componentDidCatch(error, errorInfo) {
this.setState({
error: error,
errorInfo: errorInfo
});

```
// Log error to console
console.error('Error caught by boundary:', error, errorInfo);

// Send error to monitoring service (e.g., Sentry)
if (process.env.REACT_APP_SENTRY_DSN) {
  // Sentry.captureException(error);
}
```

}

render() {
if (this.state.hasError) {
return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
</svg>
</div>
<h1 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h1>
<p className="text-gray-600 mb-4">
ขออภัย แอปพลิเคชันเกิดข้อผิดพลาดที่ไม่คาดคิด
</p>
<p className="text-sm text-gray-500 mb-6">
Something went wrong. Please refresh the page and try again.
</p>
<div className="space-y-3">
<button
onClick={() => window.location.reload()}
className=“w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors”
>
รีเฟรชหน้า
</button>
<button
onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
className=“w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors”
>
ลองใหม่
</button>
</div>

```
        {process.env.NODE_ENV === 'development' && this.state.error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              รายละเอียดข้อผิดพลาด (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-red-600 overflow-auto max-h-40">
              <div className="font-bold">Error:</div>
              <div className="mb-2">{this.state.error && this.state.error.toString()}</div>
              <div className="font-bold">Stack trace:</div>
              <div>{this.state.errorInfo.componentStack}</div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

return this.props.children;
```

}
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById(‘root’));

// Render the app with error boundary
root.render(
<React.StrictMode>
<ErrorBoundary>
<App />
</ErrorBoundary>
</React.StrictMode>
);

// Performance monitoring
reportWebVitals((metric) => {
// Log to console in development
if (process.env.NODE_ENV === ‘development’) {
console.log(‘Web Vital:’, metric);
}

// Send to analytics in production
if (process.env.NODE_ENV === ‘production’ && process.env.REACT_APP_ENABLE_ANALYTICS) {
// Send to Google Analytics or other service
if (window.gtag) {
window.gtag(‘event’, metric.name, {
event_category: ‘Web Vitals’,
event_label: metric.id,
value: Math.round(metric.value),
non_interaction: true,
});
}
}
});

// Service Worker update handling
if (‘serviceWorker’ in navigator) {
navigator.serviceWorker.addEventListener(‘controllerchange’, () => {
// Show update notification
if (window.confirm(‘แอปมีการอัปเดตใหม่ ต้องการรีเฟรชหน้าเพื่อใช้งานเวอร์ชันล่าสุดหรือไม่?’)) {
window.location.reload();
}
});

// Listen for SW messages
navigator.serviceWorker.addEventListener(‘message’, (event) => {
if (event.data && event.data.type === ‘UPDATE_AVAILABLE’) {
// Show update notification
showUpdateNotification();
}
});
}

// Update notification function
function showUpdateNotification() {
// Create update notification
const notification = document.createElement(‘div’);
notification.className = ‘fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm’;
notification.innerHTML = `<div class="flex items-center justify-between"> <div> <div class="font-medium">มีอัปเดตใหม่</div> <div class="text-sm opacity-90">คลิกเพื่ออัปเดตแอป</div> </div> <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200"> ✕ </button> </div>`;

notification.addEventListener(‘click’, () => {
if (‘serviceWorker’ in navigator && navigator.serviceWorker.controller) {
navigator.serviceWorker.controller.postMessage({ type: ‘SKIP_WAITING’ });
}
});

document.body.appendChild(notification);

// Auto remove after 10 seconds
setTimeout(() => {
if (notification.parentElement) {
notification.remove();
}
}, 10000);
}

// Handle online/offline status
window.addEventListener(‘online’, () => {
console.log(‘App is back online’);
// Could trigger sync of pending actions
if (‘serviceWorker’ in navigator && ‘sync’ in window.ServiceWorkerRegistration.prototype) {
navigator.serviceWorker.ready.then((registration) => {
return registration.sync.register(‘background-sync’);
});
}
});

window.addEventListener(‘offline’, () => {
console.log(‘App is offline’);
// Could show offline notification
});

// Handle app install prompt
let deferredPrompt;
window.addEventListener(‘beforeinstallprompt’, (e) => {
// Prevent Chrome 67 and earlier from automatically showing the prompt
e.preventDefault();
// Stash the event so it can be triggered later
deferredPrompt = e;

// Show install button or notification
showInstallPrompt();
});

function showInstallPrompt() {
// Create install prompt
const installBanner = document.createElement(‘div’);
installBanner.className = ‘fixed bottom-4 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 mx-auto max-w-sm’;
installBanner.innerHTML = `<div class="flex items-center justify-between"> <div> <div class="font-medium">ติดตั้งแอป</div> <div class="text-sm opacity-90">เพิ่ม WasteSortAI ลงหน้าจอหลัก</div> </div> <div class="flex space-x-2"> <button id="install-app" class="bg-white text-green-500 px-3 py-1 rounded text-sm font-medium"> ติดตั้ง </button> <button id="dismiss-install" class="text-white hover:text-gray-200"> ✕ </button> </div> </div>`;

document.body.appendChild(installBanner);

// Handle install button
installBanner.querySelector(’#install-app’).addEventListener(‘click’, async () => {
if (deferredPrompt) {
deferredPrompt.prompt();
const { outcome } = await deferredPrompt.userChoice;
console.log(`User response to install prompt: ${outcome}`);
deferredPrompt = null;
installBanner.remove();
}
});

// Handle dismiss button
installBanner.querySelector(’#dismiss-install’).addEventListener(‘click’, () => {
installBanner.remove();
});

// Auto remove after 15 seconds
setTimeout(() => {
if (installBanner.parentElement) {
installBanner.remove();
}
}, 15000);
}

// Handle app installed
window.addEventListener(‘appinstalled’, () => {
console.log(‘PWA was installed’);
deferredPrompt = null;

// Could send analytics event
if (window.gtag) {
window.gtag(‘event’, ‘pwa_installed’, {
event_category: ‘PWA’,
event_label: ‘installed’
});
}
});

// Keyboard shortcuts
document.addEventListener(‘keydown’, (e) => {
// Ctrl/Cmd + K to open search (if implemented)
if ((e.ctrlKey || e.metaKey) && e.key === ‘k’) {
e.preventDefault();
// Could open search modal
}

// Escape to close modals
if (e.key === ‘Escape’) {
// Could close any open modals
}
});

// Prevent right-click context menu in production
if (process.env.NODE_ENV === ‘production’) {
document.addEventListener(‘contextmenu’, (e) => {
e.preventDefault();
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
document.addEventListener(‘keydown’, (e) => {
if (e.key === ‘F12’ ||
(e.ctrlKey && e.shiftKey && e.key === ‘I’) ||
(e.ctrlKey && e.shiftKey && e.key === ‘J’) ||
(e.ctrlKey && e.key === ‘U’)) {
e.preventDefault();
}
});
}

// Development helpers
if (process.env.NODE_ENV === ‘development’) {
// Add development helpers to window for debugging
window.WasteSortAI = {
clearCache: () => {
if (‘serviceWorker’ in navigator && navigator.serviceWorker.controller) {
navigator.serviceWorker.controller.postMessage({ type: ‘CLEAR_CACHE’ });
}
localStorage.clear();
sessionStorage.clear();
window.location.reload();
},
getVersion: () => {
if (‘serviceWorker’ in navigator && navigator.serviceWorker.controller) {
navigator.serviceWorker.controller.postMessage({ type: ‘GET_VERSION’ });
}
}
};

console.log(‘🌱 WasteSortAI Development Mode’);
console.log(‘Available commands: WasteSortAI.clearCache(), WasteSortAI.getVersion()’);
}