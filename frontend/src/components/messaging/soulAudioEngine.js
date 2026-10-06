/**
 * Soul Sync Web Audio Engine
 * Pure native Web Audio API synthesizer for:
 * 1. Double-tap 528Hz crystal resonance ping
 * 2. Multi-genre preview chords & melodies without external dependencies or CORS issues
 */

let audioCtx = null;
let currentPreviewNodes = null;
let currentInterval = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * 528Hz Emotional Resonance Ping on Double-Tap
 * Gentle, pure crystal sine harmonic with soft exponential decay
 */
export function playDoubleTapPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // 528Hz — Sacred Solfeggio "Transformation and Miracles / Love Frequency"
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);
    osc1.frequency.exponentialRampToValueAtTime(1056, now + 0.35); // Gentle octave bloom

    // Harmonic overtone at 792Hz (1.5x fifth)
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(792, now);
    osc2.frequency.exponentialRampToValueAtTime(528, now + 0.3);

    // Soft master envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.65);
    osc2.stop(now + 0.65);
  } catch (e) {
    // Graceful fallback if autoplay policy or audio is disabled
  }
}

/**
 * Play procedural melody/harmony preview for a song
 */
export function playSongPreview(song, onProgress, onEnd) {
  stopCurrentSong();

  try {
    const ctx = getAudioContext();
    if (!ctx) return () => {};

    const scales = {
      major: [261.63, 329.63, 392.00, 523.25, 659.25], // C E G C E
      pentatonic: [293.66, 329.63, 369.99, 440.00, 587.33], // D E F# A D
      acoustic: [220.00, 277.18, 329.63, 440.00, 554.37], // A C# E A C#
      melodic: [349.23, 440.00, 523.25, 698.46, 880.00], // F A C F A
      synth: [130.81, 196.00, 261.63, 392.00, 523.25], // C G C G C (rich bass)
      pulse: [174.61, 220.00, 261.63, 349.23, 440.00],
      folk: [246.94, 293.66, 369.99, 493.88, 587.33]
    };

    const notes = scales[song.scale] || scales.melodic;
    const duration = 24; // 24-second preview loop
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const activeOscillators = [];
    const startTime = ctx.currentTime;

    // Arpeggiator loop
    const noteDuration = 0.55;
    const totalSteps = Math.floor(duration / noteDuration);

    for (let i = 0; i < totalSteps; i++) {
      const noteTime = startTime + i * noteDuration;
      const noteFreq = notes[i % notes.length];

      // Primary melodic voice
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = song.scale === 'synth' ? 'sawtooth' : song.scale === 'acoustic' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(noteFreq, noteTime);

      noteGain.gain.setValueAtTime(0.0001, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.06, noteTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDuration * 0.95);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + noteDuration);
      activeOscillators.push(osc);
    }

    // Progress reporting
    let elapsed = 0;
    currentInterval = setInterval(() => {
      elapsed += 0.2;
      const progress = Math.min(elapsed / duration, 1);
      if (onProgress) onProgress(progress, elapsed);
      if (progress >= 1) {
        stopCurrentSong();
        if (onEnd) onEnd();
      }
    }, 200);

    currentPreviewNodes = {
      masterGain,
      activeOscillators,
      stop: () => {
        try {
          const now = ctx.currentTime;
          masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
          setTimeout(() => {
            activeOscillators.forEach((o) => {
              try { o.stop(); } catch (e) {}
            });
            masterGain.disconnect();
          }, 200);
        } catch (e) {}
      }
    };

    return stopCurrentSong;
  } catch (e) {
    console.warn('Audio preview initialization:', e);
    return () => {};
  }
}

export function stopCurrentSong() {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }
  if (currentPreviewNodes) {
    currentPreviewNodes.stop();
    currentPreviewNodes = null;
  }
}
