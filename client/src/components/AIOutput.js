import React from 'react';
import AIReport from './AIReport';

// Detail modals use the same structured renderer as returned and saved reports.
export default function AIOutput({ analysis, loading }) {
  return <AIReport response={analysis} loading={loading} title="AI Analysis Results" />;
}
