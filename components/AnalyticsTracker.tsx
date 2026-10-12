import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../src/kbir-analytics';

// Monté une fois dans le routeur : une visite K-BIR Analytics par changement de route.
const AnalyticsTracker = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    void trackPageView(pathname);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
