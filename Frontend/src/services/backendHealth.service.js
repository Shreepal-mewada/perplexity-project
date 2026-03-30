import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://perplexity-project-zac5.onrender.com/api";

// Configuration
const CONFIG = {
  HEALTH_ENDPOINT: `${API_BASE_URL}/health`,
  RETRY_INTERVAL: 5000, // 5 seconds
  SHOW_DELAY: 2000, // Show popup after 2 seconds of no response
  MAX_RETRIES: 60, // Stop after 60 retries (5 minutes)
};

// State
let isBackendDown = false;
let retryInterval = null;
let retryCount = 0;
let listeners = new Set();
let showTimeout = null;

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await axios.get(CONFIG.HEALTH_ENDPOINT, {
      timeout: 3000, // 3 second timeout
      withCredentials: false, // No auth needed for health check
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Start polling backend health
 */
function startHealthPolling() {
  if (retryInterval) return; // Already polling

  retryCount = 0;

  retryInterval = setInterval(async () => {
    retryCount++;

    const isHealthy = await checkBackendHealth();

    if (isHealthy) {
      console.log("[Backend Health] ✅ Server is back online!");
      stopHealthPolling();
      setBackendStatus(false);

      // Retry original request if there was one
      if (window.pendingRetryRequest) {
        const pendingRequest = window.pendingRetryRequest;
        window.pendingRetryRequest = null;

        try {
          // Re-execute the pending request
          const result = await pendingRequest();
          console.log("[Backend Health] ✅ Pending request succeeded");
          return result;
        } catch (error) {
          console.error("[Backend Health] ❌ Pending request failed:", error);
        }
      }
    } else {
      console.log(
        `[Backend Health] ⏳ Still waiting... (Attempt ${retryCount}/${CONFIG.MAX_RETRIES})`
      );

      if (retryCount >= CONFIG.MAX_RETRIES) {
        stopHealthPolling();
        console.error("[Backend Health] ❌ Max retries reached");
      }
    }
  }, CONFIG.RETRY_INTERVAL);

  console.log("[Backend Health] 🔄 Started health polling");
}

/**
 * Stop polling backend health
 */
function stopHealthPolling() {
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
    console.log("[Backend Health] ⏹️ Stopped health polling");
  }

  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeout = null;
  }
}

/**
 * Update backend status and notify listeners
 */
function setBackendStatus(down) {
  isBackendDown = down;
  notifyListeners(down);
}

/**
 * Subscribe to backend status changes
 */
export function subscribeToBackendStatus(callback) {
  listeners.add(callback);

  // Return unsubscribe function
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Notify all listeners of status change
 */
function notifyListeners(down) {
  listeners.forEach((callback) => {
    try {
      callback(down);
    } catch (error) {
      console.error("[Backend Health] Listener error:", error);
    }
  });
}

/**
 * Handle API request with automatic retry for backend downtime
 */
export async function handleApiRequest(requestFn, options = {}) {
  const {
    showLoadingDelay = CONFIG.SHOW_DELAY,
    enableRetry = true,
    maxRetries = CONFIG.MAX_RETRIES,
  } = options;

  let showPopupTimeout = null;
  let attemptCount = 0;

  const executeWithRetry = async () => {
    while (attemptCount < maxRetries) {
      try {
        // Execute the request
        const result = await requestFn();

        // Clear popup timeout if request succeeds quickly
        if (showPopupTimeout) {
          clearTimeout(showPopupTimeout);
          showPopupTimeout = null;
        }

        // If we showed the popup, hide it now
        if (isBackendDown) {
          setBackendStatus(false);
          stopHealthPolling();
        }

        return result;
      } catch (error) {
        attemptCount++;

        // Check if it's a network/timeout error (backend likely down)
        const isNetworkError =
          error.code === "ECONNABORTED" ||
          error.code === "ERR_NETWORK" ||
          error.message?.includes("timeout") ||
          error.message?.includes("network") ||
          !error.response; // No response means server unreachable

        if (!isNetworkError) {
          // It's a different error (auth, validation, etc.) - throw immediately
          throw error;
        }

        console.log(`[API Retry] Attempt ${attemptCount}/${maxRetries} failed`);

        // Show popup after delay
        if (!showPopupTimeout && !isBackendDown) {
          showPopupTimeout = setTimeout(() => {
            setBackendStatus(true);
            startHealthPolling();

            // Store the pending request for retry
            window.pendingRetryRequest = requestFn;
          }, showLoadingDelay);
        }

        // Wait before retry (unless it's the last attempt)
        if (attemptCount < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, CONFIG.RETRY_INTERVAL)
          );
        }
      }
    }

    // Max retries reached
    throw new Error("Server unavailable after multiple attempts");
  };

  return executeWithRetry();
}

/**
 * Manually trigger backend health check
 */
export async function manualHealthCheck() {
  console.log("[Backend Health] 🔍 Manual health check...");
  const isHealthy = await checkBackendHealth();

  if (isHealthy && isBackendDown) {
    setBackendStatus(false);
    stopHealthPolling();
  }

  return isHealthy;
}

/**
 * Get current backend status
 */
export function getBackendStatus() {
  return isBackendDown;
}

/**
 * Reset all state (useful for logout)
 */
export function resetBackendHealth() {
  stopHealthPolling();
  setBackendStatus(false);
  retryCount = 0;
  window.pendingRetryRequest = null;
}

export default {
  checkBackendHealth,
  handleApiRequest,
  subscribeToBackendStatus,
  manualHealthCheck,
  getBackendStatus,
  resetBackendHealth,
  CONFIG,
};
