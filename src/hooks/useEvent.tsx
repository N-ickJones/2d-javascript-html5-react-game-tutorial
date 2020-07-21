import { useEffect } from 'react';

export default function useEvent(event: any, listener: any) {
  useEffect(() => {
    window.addEventListener(event, listener);

    return function cleanup() {
      window.removeEventListener(event, listener);
    };
  });
}
