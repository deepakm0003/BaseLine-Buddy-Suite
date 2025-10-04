// Test JavaScript file for Baseline compliance checking

// Fetch API - Baseline Widely
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

// structuredClone - Baseline Widely
function cloneUserData(userData) {
  return structuredClone(userData);
}

// ResizeObserver - Baseline Widely
function setupResizeObserver(element) {
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      console.log('Element resized:', entry.contentRect);
    });
  });
  
  observer.observe(element);
  return observer;
}

// View Transitions API - Baseline Newly (limited Safari support)
function navigateWithTransition(newPage) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      // Update page content
      document.body.innerHTML = newPage;
    });
  } else {
    // Fallback for unsupported browsers
    document.body.innerHTML = newPage;
  }
}

// requestIdleCallback - not Baseline (limited Safari support)
function scheduleWork(callback) {
  if (window.requestIdleCallback) {
    requestIdleCallback(callback);
  } else {
    // Fallback using setTimeout
    setTimeout(callback, 0);
  }
}

// User-Agent Client Hints API - not Baseline (Chrome-only)
function getBrowserInfo() {
  if (navigator.userAgentData) {
    return navigator.userAgentData.getHighEntropyValues(['platform', 'model']);
  } else {
    // Fallback to userAgent string
    return { userAgent: navigator.userAgent };
  }
}

// Promises - Baseline Widely
function processData(data) {
  return new Promise((resolve, reject) => {
    try {
      const processed = data.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
      }));
      resolve(processed);
    } catch (error) {
      reject(error);
    }
  });
}
