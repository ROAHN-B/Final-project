// Fix service worker registration issues
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('[SW] Registration successful');
      })
      .catch(function(error) {
        console.log('[SW] Registration failed, but continuing without it:', error);
        // Don't let SW failures break the app
      });
  });
}