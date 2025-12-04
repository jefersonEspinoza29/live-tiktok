// src/hooks/useLiveId.js
import { useMemo } from 'react';

export function useLiveId(defaultId = 'demo_live') {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('live') || defaultId;
  }, [defaultId]);
}
