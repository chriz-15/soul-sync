import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const res = await fetch(`/api/memories?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setHasSearched(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              ARCHIVAL SEARCH
            </span>
            <h2 className="modal-title">Search Living Memory</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by keyword, person, location, tag or feeling..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: '#08101E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '0 22px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {hasSearched && (
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: 12 }}>
                Found {results.length} archival match{results.length === 1 ? '' : 'es'}:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.map(r => (
                  <div key={r.id} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#08101E' }}>{r.title}</h4>
                      <span style={{ fontSize: '10px', color: '#C5A059', fontWeight: 700 }}>{r.emotion}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 4 }}>{r.description}</p>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: 6 }}>Tags: {r.tags}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
