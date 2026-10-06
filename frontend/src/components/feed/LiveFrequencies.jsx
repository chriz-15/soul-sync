import React from 'react';
import { useApp } from '../../context/AppContext';
import { Radio, Flame, Sparkles, TrendingUp } from 'lucide-react';

const LiveFrequencies = ({ onSelectFrequency }) => {
  const { showToast } = useApp();

  const frequencies = [
    {
      tag: '#VarkalaSunset',
      count: '14.2k reflections',
      vibe: '🌅 Golden Dusk & Solitude',
      pulse: 'high'
    },
    {
      tag: '#MistyMunnar',
      count: '9.8k reflections',
      vibe: '🌲 Pine Mist & Deep Silence',
      pulse: 'steady'
    },
    {
      tag: '#MidnightAcoustic',
      count: '6.4k reflections',
      vibe: '🎸 Fort Kochi Nylon Strings',
      pulse: 'steady'
    },
    {
      tag: '#LiquidGlassUI',
      count: '22.1k reflections',
      vibe: '✨ Fluid Layers & Light',
      pulse: 'high'
    },
    {
      tag: '#CoastalEchoes',
      count: '8.3k reflections',
      vibe: '🌊 Incoming Tidal Poetry',
      pulse: 'steady'
    }
  ];

  const handleClick = (freq) => {
    if (onSelectFrequency) {
      onSelectFrequency(freq.tag);
    }
    showToast(`Tuned into ${freq.tag} frequency ✨`);
  };

  return (
    <section className="soul-frequencies-panel" aria-label="Live Frequencies">
      <div className="soul-frequencies-header">
        <div className="soul-frequencies-title-wrap">
          <TrendingUp size={16} color="#B98CFF" />
          <h4 className="soul-frequencies-title">Live Frequencies</h4>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#79D9FF', fontWeight: 600 }}>
          Real-time
        </span>
      </div>

      <div className="soul-frequencies-list">
        {frequencies.map((f) => (
          <div
            key={f.tag}
            className="soul-frequency-item"
            onClick={() => handleClick(f)}
            title={`Explore reflections tagged ${f.tag}`}
          >
            <div className="soul-frequency-info">
              <span className="soul-frequency-tag">{f.tag}</span>
              <span className="soul-frequency-vibe">{f.vibe}</span>
            </div>
            <span className="soul-frequency-count-badge">{f.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveFrequencies;
