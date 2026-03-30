import { useState, useEffect } from "react";
import {
  subscribeToBackendStatus,
  getBackendStatus,
} from "../services/backendHealth.service";

/**
 * React hook to track backend availability status
 */
export function useBackendHealth() {
  const [isBackendDown, setIsBackendDown] = useState(() => getBackendStatus());

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = subscribeToBackendStatus((isDown) => {
      setIsBackendDown(isDown);
    });

    // Check initial status
    setIsBackendDown(getBackendStatus());

    return () => {
      unsubscribe();
    };
  }, []);

  return isBackendDown;
}

export default useBackendHealth;
