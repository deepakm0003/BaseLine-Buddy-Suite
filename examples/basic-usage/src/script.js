// Example JavaScript with Baseline features

// Widely available - safe to use
const data = new Map();
data.set('user', { name: 'John', age: 30 });

// Newly available - use with caution
const sorted = [3, 1, 4, 1, 5].toSorted();

// Limited support - not recommended
const result = Promise.try(() => {
  return fetch('/api/data');
});

// Widely available - safe to use
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// Newly available - use with fallback
function processItems(items) {
  return items.toReversed().toSorted();
}

// Limited support - avoid in production
function useNewAPI() {
  return navigator.storage.estimate();
}
