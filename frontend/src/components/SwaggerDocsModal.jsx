import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, Terminal, CheckCircle } from 'lucide-react';

export default function SwaggerDocsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('iframe');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickEndpoints = [
    { method: 'GET', path: '/api/memories', label: 'List Archival Memories' },
    { method: 'GET', path: '/api/journal', label: 'Fetch Journal Entries' },
    { method: 'GET', path: '/api/partner', label: 'Get Partner Space' },
    { method: 'GET', path: '/api/time-capsules', label: 'Get Time Capsules' },
    { method: 'GET', path: '/api/feelings/options', label: 'List Feelings Resonances' },
    { method: 'GET', path: '/api/system/status', label: 'System Health & Rev 2.04' }
  ];

  const runTest = async (ep) => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(ep.path);
      const data = await res.json();
      setTestResult({
        endpoint: `${ep.method} ${ep.path}`,
        status: res.status,
        data
      });
    } catch (err) {
      setTestResult({
        endpoint: `${ep.method} ${ep.path}`,
        status: 'Error',
        data: { error: err.message }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 1080, height: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '11px', background: '#10B981', color: '#064E3B', padding: '3px 10px', borderRadius: 999, fontWeight: 800 }}>
              FASTAPI + SWAGGER
            </span>
            <h2 className="modal-title">Interactive Middleware API Docs</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#08101E',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#F1F5F9',
                padding: '6px 12px',
                borderRadius: 8
              }}
            >
              <span>Open in New Tab</span>
              <ExternalLink size={12} />
            </a>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div style={{ display: 'flex', gap: 10, padding: '10px 30px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <button
            onClick={() => setActiveTab('iframe')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'iframe' ? '#08101E' : 'transparent',
              color: activeTab === 'iframe' ? '#FFFFFF' : '#64748B',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Swagger UI Live Frame
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'explorer' ? '#08101E' : 'transparent',
              color: activeTab === 'explorer' ? '#FFFFFF' : '#64748B',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Fast Endpoint Tester
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'iframe' ? (
            <iframe
              src="http://localhost:8000/docs"
              title="FastAPI Swagger Documentation"
              style={{ width: '100%', height: '100%', border: 'none', background: '#FFFFFF' }}
            />
          ) : (
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Click to Test REST API Endpoints:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginBottom: 24 }}>
                {quickEndpoints.map((ep, idx) => (
                  <button
                    key={idx}
                    onClick={() => runTest(ep)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 4, fontWeight: 800, marginRight: 8 }}>
                        {ep.method}
                      </span>
                      <strong style={{ fontSize: '12px', color: '#0F172A' }}>{ep.label}</strong>
                      <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace', marginTop: 2 }}>{ep.path}</div>
                    </div>
                  </button>
                ))}
              </div>

              {loading && <p style={{ color: '#64748B' }}>Executing API call to FastAPI middleware...</p>}

              {testResult && (
                <div style={{ background: '#0F172A', color: '#F8FAFC', borderRadius: 12, padding: 18, fontFamily: 'monospace', fontSize: '12px', overflowX: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: 8, marginBottom: 10 }}>
                    <span style={{ color: '#38BDF8' }}>{testResult.endpoint}</span>
                    <span style={{ color: '#4ADE80' }}>STATUS: {testResult.status}</span>
                  </div>
                  <pre style={{ margin: 0 }}>{JSON.stringify(testResult.data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
