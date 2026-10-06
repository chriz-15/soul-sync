import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_CONFIG } from './categoryPresets';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Star,
  Eye,
  Layers,
  GraduationCap,
  Heart,
  Compass,
  FileText,
  Tag,
  X
} from 'lucide-react';

const CategoryMemoryExperience = ({
  categoryKey = 'travel',
  originRect = null,
  onClose
}) => {
  const { soulMoments, handleSaveMoment, showToast, setActiveMomentDetail } = useApp();
  const config = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.travel;

  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'collections'
  const [isClosing, setIsClosing] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [dateField, setDateField] = useState('');
  const [locationField, setLocationField] = useState('');
  const [peopleField, setPeopleField] = useState('');
  const [specialType, setSpecialType] = useState('Birthday');
  const [customType, setCustomType] = useState('');
  const [whySpecial, setWhySpecial] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [academicPeriod, setAcademicPeriod] = useState('');
  const [occasion, setOccasion] = useState('');
  const [experienceNotes, setExperienceNotes] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  // Multi-Photo Upload State
  const [photos, setPhotos] = useState([]);
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Origin transform style calculation for flowing / blowing motion
  const originStyle = originRect
    ? {
        '--origin-x': `${originRect.centerX}px`,
        '--origin-y': `${originRect.centerY}px`,
        '--flow-dx': `${originRect.flowDx || 0}px`,
        '--flow-dy': `${originRect.flowDy || -50}px`
      }
    : {
        '--flow-dx': '0px',
        '--flow-dy': '-50px'
      };

  // Load sample template values based on category
  const handleLoadDemoData = () => {
    if (categoryKey === 'travel') {
      setTitle(config.sampleTitle);
      setLocationField(config.samplePlace);
      setDateField(config.sampleDateRange);
      setPeopleField(config.samplePeople);
      setExperienceNotes(config.sampleNotes);
      setPhotos([...config.samplePhotos]);
    } else if (categoryKey === 'favorite') {
      setTitle(config.sampleTitle);
      setDateField(config.sampleDate);
      setPeopleField(config.samplePeople);
      setWhySpecial(config.sampleWhySpecial);
      setExperienceNotes(config.sampleNotes);
      setPhotos([...config.samplePhotos]);
    } else if (categoryKey === 'special') {
      setTitle(config.sampleTitle);
      setSpecialType(config.sampleType);
      setDateField(config.sampleDate);
      setPeopleField(config.samplePeople);
      setWhatHappened(config.sampleWhatHappened);
      setExperienceNotes(config.sampleNotes);
      setPhotos([...config.samplePhotos]);
    } else if (categoryKey === 'college') {
      setTitle(config.sampleTitle);
      setLocationField(config.sampleCollege);
      setAcademicPeriod(config.samplePeriod);
      setOccasion(config.sampleOccasion);
      setPeopleField(config.sampleFriends);
      setExperienceNotes(config.sampleStory);
      setPersonalNotes(config.samplePersonalNotes);
      setPhotos([...config.samplePhotos]);
    }
    showToast(`Loaded ${config.name} sample collection ✨`);
  };

  // Multiple File Upload Handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target.result;
        setPhotos((prev) => [...prev, resultUrl]);
      };
      reader.readAsDataURL(file);
    });

    showToast(`Added ${files.length} photo(s) to collection`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add single URL
  const handleAddPhotoUrl = () => {
    if (manualPhotoUrl.trim()) {
      setPhotos((prev) => [...prev, manualPhotoUrl.trim()]);
      setManualPhotoUrl('');
    }
  };

  // Remove photo
  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Set cover photo
  const handleSetCover = (index) => {
    setPhotos((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
    showToast('Cover photo updated ✨');
  };

  // Smooth Back Navigation Handler
  const handleBackToMoments = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 340);
  };

  // Handle Save Collection
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a collection title');
      return;
    }

    if (photos.length === 0) {
      showToast('Please add at least one photo to this collection');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build summary caption based on category
      let summaryCaption = '';
      if (categoryKey === 'travel') {
        summaryCaption = `Trip to ${locationField || 'unspecified location'} • ${photos.length} photos preserved`;
      } else if (categoryKey === 'favorite') {
        summaryCaption = whySpecial || 'A deeply cherished personal memory';
      } else if (categoryKey === 'special') {
        summaryCaption = `${specialType === 'Custom' ? customType : specialType} • ${whatHappened || 'Milestone celebration'}`;
      } else if (categoryKey === 'college') {
        summaryCaption = `${occasion || 'Campus Life'} • ${locationField || 'College'} • ${academicPeriod || ''}`;
      }

      // Combine notes and story into a single comprehensive memory reflection
      let combinedPrivateNotes = experienceNotes.trim();
      if (categoryKey === 'favorite' && whySpecial) {
        combinedPrivateNotes = `Why this memory is special:\n${whySpecial}\n\nStory & Notes:\n${combinedPrivateNotes}`;
      } else if (categoryKey === 'special' && whatHappened) {
        combinedPrivateNotes = `What happened:\n${whatHappened}\n\nExperience & Notes:\n${combinedPrivateNotes}`;
      } else if (categoryKey === 'college' && personalNotes) {
        combinedPrivateNotes = `${combinedPrivateNotes}\n\nPersonal Notes:\n${personalNotes}`;
      }

      const momentPayload = {
        title: title.trim(),
        caption: summaryCaption,
        memory_date: dateField || new Date().toISOString().split('T')[0],
        location: locationField.trim(),
        people_involved: peopleField.trim(),
        private_note: combinedPrivateNotes,
        collection_id: config.collectionId,
        memory_type: 'custom',
        // Store all 25–30 photos together in ONE memory entry as JSON array
        media_url: JSON.stringify(photos)
      };

      const res = await handleSaveMoment(momentPayload);
      if (res && res.success) {
        showToast(`${config.name} collection saved! (${photos.length} photos) ✨`);
        // Switch to review tab
        setActiveTab('collections');
        // Reset form
        setTitle('');
        setDateField('');
        setLocationField('');
        setPeopleField('');
        setExperienceNotes('');
        setPhotos([]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save memory collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to extract photos from a memory entry
  const parseMemoryPhotos = (m) => {
    if (!m || !m.media_url) return [];
    if (Array.isArray(m.media_url)) return m.media_url;
    if (typeof m.media_url === 'string' && m.media_url.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(m.media_url);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [m.media_url];
  };

  // Existing collections under this category
  const existingCollections = soulMoments.filter(
    (m) => m.collection_id === config.collectionId
  );

  return (
    <div className={`category-exp-backdrop ${isClosing ? 'closing' : ''}`} onClick={handleBackToMoments}>
      <div
        className={`category-exp-panel ${isClosing ? 'closing' : 'opening'}`}
        style={originStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${config.name} Experience`}
      >
        {/* ====================================================
            PANEL HEADER & BACK TO SOUL MOMENTS
            ==================================================== */}
        <div className="category-exp-header">
          <div className="category-exp-header-left">
            <button
              type="button"
              className="btn-secondary-glass category-back-to-moments-btn"
              onClick={handleBackToMoments}
              aria-label="Back to Soul Moments"
            >
              <ArrowLeft size={16} />
              <span>← Back to Soul Moments</span>
            </button>

            <div className="category-exp-title-block">
              <div className="category-exp-badge">
                <span className="category-exp-icon">{config.icon}</span>
                <span className="category-exp-badge-name">{config.name}</span>
                <span className="category-exp-badge-type">Complete Collection</span>
              </div>
              <h2 className="category-exp-main-title">{config.title}</h2>
              <p className="category-exp-sub-desc">{config.subtitle}</p>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="category-exp-nav-tabs">
            <button
              type="button"
              className={`category-exp-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <Plus size={14} />
              <span>Create Collection</span>
            </button>
            <button
              type="button"
              className={`category-exp-tab-btn ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => setActiveTab('collections')}
            >
              <Layers size={14} />
              <span>Preserved Collections ({existingCollections.length})</span>
            </button>
          </div>
        </div>

        {/* ====================================================
            VIEW A: CREATE COMPLETE MEMORY COLLECTION
            ==================================================== */}
        {activeTab === 'create' ? (
          <form onSubmit={handleSubmit} className="category-exp-form">
            {/* Quick Demo Pre-fill Banner */}
            <div className="category-exp-demo-bar">
              <div className="category-exp-demo-text">
                <Sparkles size={14} color="#B98CFF" />
                <span>
                  Tip: A single {config.name.toLowerCase()} collection can hold 25–30+ photos and your complete personal story.
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary-glass category-demo-btn"
                onClick={handleLoadDemoData}
              >
                <Sparkles size={13} color="#79D9FF" />
                <span>Load Sample {config.name} (25+ Photos)</span>
              </button>
            </div>

            {/* Core Metadata Row 1 */}
            <div className="category-form-grid-2">
              <div className="category-form-group">
                <label className="category-form-label">
                  {categoryKey === 'travel' && 'Trip Title *'}
                  {categoryKey === 'favorite' && 'Memory Title *'}
                  {categoryKey === 'special' && 'Special Day Title *'}
                  {categoryKey === 'college' && 'Memory / Collection Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    categoryKey === 'travel'
                      ? 'e.g., 3 Days in Varkala'
                      : categoryKey === 'favorite'
                      ? 'e.g., Our First Long Drive'
                      : categoryKey === 'special'
                      ? "e.g., Megha's 24th Birthday Celebration"
                      : 'e.g., Final Year Memories — Batch of 2026'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>

              <div className="category-form-group">
                <label className="category-form-label">
                  <Calendar size={13} />
                  <span>
                    {categoryKey === 'travel' ? 'Travel Date / Date Range' : 'Date'}
                  </span>
                </label>
                <input
                  type="text"
                  placeholder={
                    categoryKey === 'travel'
                      ? 'e.g., September 21 – September 23, 2026'
                      : 'e.g., October 14, 2025'
                  }
                  value={dateField}
                  onChange={(e) => setDateField(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>
            </div>

            {/* Category-Specific Row 2 */}
            <div className="category-form-grid-2">
              {categoryKey === 'travel' && (
                <div className="category-form-group">
                  <label className="category-form-label">
                    <MapPin size={13} />
                    <span>Travel Place / Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Varkala Cliff, Kerala"
                    value={locationField}
                    onChange={(e) => setLocationField(e.target.value)}
                    className="glass-input-field category-form-input"
                  />
                </div>
              )}

              {categoryKey === 'college' && (
                <>
                  <div className="category-form-group">
                    <label className="category-form-label">
                      <GraduationCap size={13} />
                      <span>College / Institution</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kerala Technical Institute"
                      value={locationField}
                      onChange={(e) => setLocationField(e.target.value)}
                      className="glass-input-field category-form-input"
                    />
                  </div>
                  <div className="category-form-group">
                    <label className="category-form-label">
                      <span>Year / Academic Period</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2022 – 2026 / Final Semester"
                      value={academicPeriod}
                      onChange={(e) => setAcademicPeriod(e.target.value)}
                      className="glass-input-field category-form-input"
                    />
                  </div>
                </>
              )}

              {categoryKey === 'special' && (
                <div className="category-form-group">
                  <label className="category-form-label">
                    <Sparkles size={13} />
                    <span>Special Day Type</span>
                  </label>
                  <div className="category-type-pill-selector">
                    {config.specialTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`category-type-pill ${specialType === type ? 'active' : ''}`}
                        onClick={() => setSpecialType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {specialType === 'Custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom occasion..."
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="glass-input-field category-form-input"
                      style={{ marginTop: '0.5rem' }}
                    />
                  )}
                </div>
              )}

              {/* People Involved (Shared across all) */}
              <div className="category-form-group">
                <label className="category-form-label">
                  <Users size={13} />
                  <span>
                    {categoryKey === 'college'
                      ? 'Friends / People Involved (optional)'
                      : 'People Involved (optional)'}
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Megha, Arjun, Sahana"
                  value={peopleField}
                  onChange={(e) => setPeopleField(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>
            </div>

            {/* Special Context Prompts */}
            {categoryKey === 'favorite' && (
              <div className="category-form-group">
                <label className="category-form-label">
                  <Heart size={13} color="#D4427E" />
                  <span>Why This Memory is Special</span>
                </label>
                <input
                  type="text"
                  placeholder="What makes this memory stand out from everyday moments?"
                  value={whySpecial}
                  onChange={(e) => setWhySpecial(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>
            )}

            {categoryKey === 'special' && (
              <div className="category-form-group">
                <label className="category-form-label">
                  <FileText size={13} />
                  <span>What Happened (Highlights / Event Summary)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Midnight surprise cake cutting followed by rooftop dinner..."
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>
            )}

            {categoryKey === 'college' && (
              <div className="category-form-group">
                <label className="category-form-label">
                  <Tag size={13} />
                  <span>Event / Occasion</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cul-Fest 2026, Freshers Day, Last Day of College"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>
            )}

            {/* ====================================================
                MULTIPLE PHOTO UPLOAD DROPZONE & GRID
                ==================================================== */}
            <div className="category-upload-section">
              <div className="category-upload-header">
                <div>
                  <h4 className="category-upload-title">
                    <span>Multiple Photo Upload</span>
                    <span className="category-upload-count-pill">
                      {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'} in Collection
                    </span>
                  </h4>
                  <p className="category-upload-subtitle">
                    All photos belong to this single {config.name.toLowerCase()} memory collection (add 25–30+ photos freely).
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="btn-secondary-glass"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus size={14} />
                    <span>Upload From Device</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Paste URL Input bar */}
              <div className="category-url-input-row">
                <input
                  type="url"
                  placeholder="Paste image URL to add..."
                  value={manualPhotoUrl}
                  onChange={(e) => setManualPhotoUrl(e.target.value)}
                  className="glass-input-field category-url-field"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPhotoUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary-glass"
                  onClick={handleAddPhotoUrl}
                >
                  Add Photo
                </button>
              </div>

              {/* Photos Gallery Grid */}
              {photos.length === 0 ? (
                <div
                  className="category-empty-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={38} className="category-dropzone-icon" />
                  <p className="category-dropzone-prompt">
                    Click to select multiple photos, or drag and drop files here
                  </p>
                  <span className="category-dropzone-hint">
                    Supports high-resolution PNG, JPG, WebP • 25–30 photos per collection
                  </span>
                </div>
              ) : (
                <div className="category-photos-grid">
                  {photos.map((photoUrl, idx) => (
                    <div key={idx} className="category-photo-item">
                      <img
                        src={photoUrl}
                        alt={`Photo ${idx + 1}`}
                        className="category-photo-thumb"
                        onClick={() => setPreviewPhotoUrl(photoUrl)}
                      />

                      {/* First Photo is Cover */}
                      {idx === 0 && (
                        <div className="category-cover-badge" title="Collection Cover Photo">
                          <Star size={10} fill="#B98CFF" color="#B98CFF" />
                          <span>Cover</span>
                        </div>
                      )}

                      {/* Photo Actions Overlay */}
                      <div className="category-photo-actions-overlay">
                        {idx !== 0 && (
                          <button
                            type="button"
                            className="category-photo-action-btn"
                            onClick={() => handleSetCover(idx)}
                            title="Set as Cover Photo"
                          >
                            <Star size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="category-photo-action-btn view-btn"
                          onClick={() => setPreviewPhotoUrl(photoUrl)}
                          title="View Full Size"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          type="button"
                          className="category-photo-action-btn delete-btn"
                          onClick={() => handleRemovePhoto(idx)}
                          title="Remove Photo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <span className="category-photo-index">{idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ====================================================
                LARGE EXPERIENCE / STORY NOTES TEXTAREA
                ==================================================== */}
            <div className="category-form-group">
              <label className="category-form-label">
                <FileText size={13} />
                <span>
                  {categoryKey === 'travel' && 'Travel Experience / Travel Notes *'}
                  {categoryKey === 'favorite' && 'Favorite Memory Story / Notes *'}
                  {categoryKey === 'special' && 'Special Day Experience / Notes *'}
                  {categoryKey === 'college' && 'College Experience / Story *'}
                </span>
              </label>
              <textarea
                required
                rows={5}
                placeholder={
                  categoryKey === 'travel'
                    ? 'Write your complete travel experience, memorable moments, feelings, food, sights, sunsets...'
                    : categoryKey === 'favorite'
                    ? 'Write your complete personal story and why these photos and moments are special...'
                    : categoryKey === 'special'
                    ? 'Describe what happened that day, who was there, and why it was memorable...'
                    : 'Tell your unforgettable campus story, the memories you made together, and the feelings you preserve...'
                }
                value={experienceNotes}
                onChange={(e) => setExperienceNotes(e.target.value)}
                className="glass-input-field category-form-textarea"
              />
            </div>

            {/* College Personal Notes (Optional) */}
            {categoryKey === 'college' && (
              <div className="category-form-group">
                <label className="category-form-label">
                  <span>Personal Notes / Private Takeaway</span>
                </label>
                <input
                  type="text"
                  placeholder="Private thoughts, life lessons, or words for the future..."
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  className="glass-input-field category-form-input"
                />
              </div>
            )}

            {/* ====================================================
                FOOTER SAVE ACTION
                ==================================================== */}
            <div className="category-form-footer">
              <button
                type="button"
                className="btn-secondary-glass"
                onClick={handleBackToMoments}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary-gradient category-submit-btn"
                disabled={isSubmitting}
              >
                <Sparkles size={16} />
                <span>
                  {isSubmitting
                    ? 'Saving Collection...'
                    : categoryKey === 'travel'
                    ? 'Save Travel Memory'
                    : categoryKey === 'favorite'
                    ? 'Save Favorite Memory'
                    : categoryKey === 'special'
                    ? 'Save Special Day'
                    : 'Save College Memory'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          /* ====================================================
              VIEW B: PRESERVED COLLECTIONS GALLERY
              ==================================================== */
          <div className="category-preserved-gallery">
            {existingCollections.length === 0 ? (
              <div className="category-preserved-empty">
                <span className="category-exp-icon" style={{ fontSize: '2.5rem' }}>
                  {config.icon}
                </span>
                <h3>No {config.name} Collections Saved Yet</h3>
                <p>
                  Create your first complete {config.name.toLowerCase()} memory with multiple photos and a rich story.
                </p>
                <button
                  type="button"
                  className="btn-primary-gradient"
                  onClick={() => setActiveTab('create')}
                >
                  <Plus size={15} />
                  <span>Create {config.name} Collection</span>
                </button>
              </div>
            ) : (
              <div className="category-collections-grid">
                {existingCollections.map((m) => {
                  const mPhotos = parseMemoryPhotos(m);
                  const coverPhoto = mPhotos[0] || m.media_url;

                  return (
                    <article key={m.id} className="category-collection-card">
                      {/* Photo Mosaic / Stack Header */}
                      <div className="category-card-mosaic-wrap">
                        <img
                          src={coverPhoto}
                          alt={m.title}
                          className="category-card-cover-img"
                        />
                        <div className="category-card-overlay-gradient" />

                        <div className="category-card-count-badge">
                          <Layers size={12} color="#F5F3F7" />
                          <span>{mPhotos.length} {mPhotos.length === 1 ? 'Photo' : 'Photos'}</span>
                        </div>

                        {m.location && (
                          <div className="category-card-loc-pill">
                            <MapPin size={11} />
                            <span>{m.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="category-card-body">
                        <div className="category-card-date-row">
                          <Calendar size={12} />
                          <span>{m.memory_date}</span>
                          {m.people_involved && (
                            <>
                              <span>•</span>
                              <Users size={12} />
                              <span>{m.people_involved}</span>
                            </>
                          )}
                        </div>

                        <h3 className="category-card-title">{m.title}</h3>

                        {m.caption && (
                          <p className="category-card-caption">"{m.caption}"</p>
                        )}

                        {m.private_note && (
                          <div className="category-card-story-box">
                            <p className="category-card-story-text">
                              {m.private_note}
                            </p>
                          </div>
                        )}

                        {/* Photo Previews Strip */}
                        {mPhotos.length > 1 && (
                          <div className="category-card-thumbs-strip">
                            {mPhotos.slice(0, 6).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Thumb ${i}`}
                                className="category-card-strip-thumb"
                                onClick={() => setPreviewPhotoUrl(url)}
                              />
                            ))}
                            {mPhotos.length > 6 && (
                              <div
                                className="category-card-strip-more"
                                onClick={() => setActiveMomentDetail(m)}
                              >
                                +{mPhotos.length - 6}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Link */}
                        <div className="category-card-footer-action">
                          <button
                            type="button"
                            className="btn-secondary-glass"
                            onClick={() => setActiveMomentDetail(m)}
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            <span>Open Complete Collection Experience</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            LIGHTBOX PHOTO PREVIEW MODAL
            ==================================================== */}
        {previewPhotoUrl && (
          <div
            className="category-lightbox-backdrop"
            onClick={() => setPreviewPhotoUrl(null)}
          >
            <div className="category-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="category-lightbox-close-btn"
                onClick={() => setPreviewPhotoUrl(null)}
              >
                <X size={20} />
              </button>
              <img
                src={previewPhotoUrl}
                alt="Enlarged memory"
                className="category-lightbox-img"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMemoryExperience;
