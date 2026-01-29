import type { Metric } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

type PerfEntryHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: PerfEntryHandler) => {
  if (!onPerfEntry) return;

  onCLS(onPerfEntry);
  onINP(onPerfEntry);
  onFCP(onPerfEntry);
  onLCP(onPerfEntry);
  onTTFB(onPerfEntry);
};

export default reportWebVitals;
