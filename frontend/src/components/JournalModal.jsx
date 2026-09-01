import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, Plus, Check } from 'lucide-react';

export default function JournalModal({ isOpen, onClose }) {
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Grateful');
  const [isWriting, setIsWriting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiReflectionPreview, setAiReflectionPreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [resEntries, resPrompts] = await Promise.all([
        fetch('/api/journal'),
        fetch('/api/journal/prompts')
      ]);
      if (resEntries.ok) {
        const d = await resEntries.json();
        setEntries(d);
      }
      if (resPrompts.ok) {
        const p = await resPrompts.json();
        setPrompts(p.prompts || []);
        if (p.prompts?.length > 0) setSelectedPrompt(p.prompts[0]);
      }
    } catch (err) {
      console.error('Failed loading journal data:', err);
    }
  };

  const handleAiReflect = async () => {
    if (!content) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/journal/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mood })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReflectionPreview(data.reflection);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          prompt_used: selectedPrompt,
          mood,
          ai_reflection: aiReflectionPreview
        })
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setAiReflectionPreview('');
        setIsWriting(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 840 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              NARRATIVE LOGS
            </span>
            <h2 className="modal-title">Journaling AI & Reflections</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
              The power of the written word, from quick notes to deep reflections.
            </p>
            <button
              onClick={() => setIsWriting(!isWriting)}
              style={{
                background: isWriting ? '#F1F5F9' : '#08101E',
                color: isWriting ? '#08101E' : '#FFFFFF',
                border: 'none',
                borderRadius: 999,
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Plus size={16} />
              <span>{isWriting ? 'View Log Archive' : 'New Journal Entry'}</span>
            </button>
          </div>

          {isWriting ? (
            <form onSubmit={handleSaveEntry}>
              {/* Prompt Suggestions */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="#C5A059" />
                  <span>Journaling AI Prompt Suggestions</span>
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {prompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPrompt(p)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: selectedPrompt === p ? '1.5px solid #08101E' : '1px solid #E2E8F0',
                        background: selectedPrompt === p ? '#F8FAFC' : '#FFFFFF',
                        color: selectedPrompt === p ? '#08101E' : '#64748B',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Entry Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. The Texture of a Sunday Morning"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Narrative Reflection</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Write freely... what did this moment feel like?"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              {/* AI Deepen Reflection Button */}
              <div style={{ marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={handleAiReflect}
                  disabled={aiGenerating || !content}
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    color: '#15803D',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={14} />
                  <span>{aiGenerating ? 'Analyzing reflection...' : 'Generate AI Deep Reflection'}</span>
                </button>
                {aiReflectionPreview && (
                  <div style={{ marginTop: 10, padding: 14, background: '#F8FAFC', borderLeft: '3px solid #16A34A', borderRadius: 6, fontSize: '0.88rem', color: '#166534', fontStyle: 'italic' }}>
                    "{aiReflectionPreview}"
                  </div>
                )}
              </div>

              <button type="submit" className="primary-action-btn">
                <span>Save to Narrative Logs</span>
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {entries.map(entry => (
                <div key={entry.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#08101E' }}>
                      {entry.title}
                    </h3>
                    <span style={{ fontSize: '10.5px', background: '#FCE8C3', color: '#78350F', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                      {entry.mood}
                    </span>
                  </div>

                  {entry.prompt_used && (
                    <p style={{ fontSize: '11.5px', color: '#64748B', fontStyle: 'italic', marginBottom: 10 }}>
                      Prompt: "{entry.prompt_used}"
                    </p>
                  )}

                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, marginBottom: 14 }}>
                    {entry.content}
                  </p>

                  {entry.ai_reflection && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: '#059669' }}>
                      ✨ <strong>Journaling AI Reflection:</strong> {entry.ai_reflection}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
