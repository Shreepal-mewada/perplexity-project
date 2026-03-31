import { useState, useEffect } from "react";
import {
  subscribeToBackendStatus,
  getBackendStatus,
} from "../services/backendHealth.service";

export function useBackendHealth() {
  const [isBackendDown, setIsBackendDown] = useState(() => getBackendStatus());

  useEffect(() => {
    setIsBackendDown(getBackendStatus());
    const unsubscribe = subscribeToBackendStatus((isDown) => {
      setIsBackendDown(isDown);
    });
    return unsubscribe;
  }, []);

  return isBackendDown;
}

export default useBackendHealth;
