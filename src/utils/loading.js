// Define the loading element
const loadingElement = document.createElement('div');
loadingElement.classList.add('loading');
loadingElement.innerHTML = '<div class="loading-spinner"></div>';

// Define the styles for the loading element
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Add the loading element and styles to the document
document.body.appendChild(loadingElement);
document.head.appendChild(styleElement);

// Show and hide the loading element
function showLoading() {
  loadingElement.style.display = 'flex';
}

function hideLoading() {
  loadingElement.style.display = 'none';
}

/* let loading = null;

function showLoading() {
  loading = document.createElement('div');
  loading.classList.add('loading');
  document.body.appendChild(loading);
}

function hideLoading() {
  if (loading) {
    loading.remove();
    loading = null;
  }
} */


// Use a debounce function to prevent the loading element from flickering
let timeoutId = null;

function debounce(func, delay) {
  return function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  }
}

// Show and hide the loading element with a debounce of 500ms
const debouncedShowLoading = debounce(showLoading, 500);
const debouncedHideLoading = debounce(hideLoading, 500);

export { debouncedShowLoading, debouncedHideLoading };
