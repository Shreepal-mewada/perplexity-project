import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://perplexity-project-zac5.onrender.com/api";

// Health endpoint is at the server root, not under /api
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

const CONFIG = {
  HEALTH_ENDPOINT: `${SERVER_BASE_URL}/health`,
  POLL_INTERVAL: 5000,
  REQUEST_TIMEOUT: 3000,
};

// ── Module-level singleton state ──
let isBackendDown = false;
let pollTimer = null;
let listeners = new Set();
let healthyResolvers = [];

// ── Helpers ──

function isNetworkError(error) {
  return (
    error.code === "ERR_NETWORK" ||
    error.code === "ECONNABORTED" ||
    error.message?.includes("timeout") ||
    error.message?.includes("Network Error") ||
    !error.response
  );
}

function notifyListeners(down) {
  listeners.forEach((cb) => {
    try {
      cb(down);
    } catch (e) {
      console.error("[Backend Health] Listener error:", e);
    }
  });
}

// ── Health check ──

export async function checkBackendHealth() {
  try {
    console.log("[Backend Health] 🔍 Checking health endpoint...");
    const response = await axios.get(CONFIG.HEALTH_ENDPOINT, {
      timeout: CONFIG.REQUEST_TIMEOUT,
      withCredentials: false,
    });
    const healthy = response.status >= 200 && response.status < 300;
    console.log(
      `[Backend Health] ${healthy ? "✅ Healthy" : "❌ Unhealthy"} (status: ${response.status})`
    );
    return healthy;
  } catch (error) {
    console.log(
      `[Backend Health] ❌ Health check failed: ${error.code || error.message}`
    );
    return false;
  }
}

// ── Polling ──

function startPolling() {
  if (pollTimer) {
    console.log("[Backend Health] ⚠️ Polling already active, skipping");
    return;
  }
  console.log("[Backend Health] 🔄 Starting health polling every 5s...");
  pollTimer = setInterval(async () => {
    const healthy = await checkBackendHealth();
    if (healthy) {
      console.log("[Backend Health] ✅ Server is back online!");
      recoverBackend();
    }
  }, CONFIG.POLL_INTERVAL);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    console.log("[Backend Health] ⏹️ Stopped health polling");
  }
}

// ── State transitions ──

function markBackendDown() {
  if (isBackendDown) return; // already down, no-op
  isBackendDown = true;
  console.log("[Backend Health] 🚨 Backend marked as DOWN");
  notifyListeners(true);
  startPolling();
}

function recoverBackend() {
  stopPolling();
  if (!isBackendDown) return; // already healthy, no-op
  isBackendDown = false;
  console.log("[Backend Health] ✅ Backend marked as HEALTHY");
  notifyListeners(false);
  // Unblock all waiting requests
  const resolvers = healthyResolvers;
  healthyResolvers = [];
  resolvers.forEach((resolve) => resolve());
}

// ── Wait primitive ──

function waitForHealthy() {
  return new Promise((resolve) => {
    if (!isBackendDown) {
      resolve();
      return;
    }
    healthyResolvers.push(resolve);
  });
}

// ── Public API ──

/**
 * Wrap any API call with automatic downtime detection and recovery.
 * On network error: marks backend down, shows popup, blocks until
 * server recovers, then retries the original request once.
 */
export async function handleApiRequest(requestFn, _options = {}) {
  try {
    const result = await requestFn();
    // If backend was down but recovered during this request
    if (isBackendDown) {
      recoverBackend();
    }
    return result;
  } catch (error) {
    // Non-network errors (401, 404, validation, etc.) pass through immediately
    if (!isNetworkError(error)) {
      throw error;
    }

    console.log(
      `[Backend Health] 🚨 Network error detected: ${error.code || error.message}`
    );

    // Mark down, show popup, start polling
    markBackendDown();

    // Block until the health check confirms the server is back
    console.log("[Backend Health] ⏳ Waiting for backend to recover...");
    await waitForHealthy();
    console.log("[Backend Health] 🔄 Retrying original request...");

    // Retry the original request once
    const result = await requestFn();

    // Ensure we're marked healthy after successful retry
    if (isBackendDown) {
      recoverBackend();
    }

    return result;
  }
}

export function subscribeToBackendStatus(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getBackendStatus() {
  return isBackendDown;
}

export function resetBackendHealth() {
  stopPolling();
  isBackendDown = false;
  healthyResolvers = [];
  notifyListeners(false);
  console.log("[Backend Health] 🔄 State reset");
}

export default {
  checkBackendHealth,
  handleApiRequest,
  subscribeToBackendStatus,
  getBackendStatus,
  resetBackendHealth,
  CONFIG,
};
