'use client';

import React, { useState, useRef } from 'react';
import { Image } from 'lucide-react';

const BottomInputBar = ({
  showInputBar,
  setShowInputBar,
  showChatButton,
  setShowChatButton,
  uploadedFile,
  setUploadedFile,
  previewUrl,
  setPreviewUrl,
  inputText,
  setInputText,
  imageUrl,
  setImageUrl,
  selectedAspect,
  setSelectedAspect,
  selectedDuration,
  setSelectedDuration,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleGenerate,
  selectedEffect,
  selectedResolution,
  setSelectedResolution,
  selectedQuality,
  setSelectedQuality
}) => {
  const [remixHover, setRemixHover] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [pendingGenerate, setPendingGenerate] = useState(false);
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [minimizedVideoPopup, setMinimizedVideoPopup] = useState(false);

  // Set default dropdown values
  React.useEffect(() => {
    if (!selectedAspect) setSelectedAspect('9:16');
    if (!selectedDuration) setSelectedDuration('5s');
    if (!selectedResolution) setSelectedResolution('480p');
    if (!selectedQuality) setSelectedQuality('medium');
    // eslint-disable-next-line
  }, []);

  // Dummy video URL for demonstration; replace with your real video URL logic
  const videoUrl = previewUrl || (imageUrl && imageUrl.endsWith('.mp4') ? imageUrl : null);

  // Wrap the generate handler to show modal first, but only if all required fields are present
  function handleGenerateWithApiKey(e) {
    e.preventDefault && e.preventDefault();
    // Validation: require effect selection AND (image or text)
    const hasImage = (uploadedFile && previewUrl) || (inputText && (inputText.startsWith('http://') || inputText.startsWith('https://')));
    const hasText = inputText && inputText.trim().length > 0;
    // Dropdown validation
    if (!selectedAspect || !selectedDuration || !selectedResolution || !selectedQuality) {
      alert('Please select all dropdown options (aspect ratio, duration, size, and quality) before generating.');
      return;
    }
    if (!selectedEffect) {
      alert('Please select an effect before generating.');
      return;
    }
    if (!(hasImage || hasText)) {
      alert('Please provide an image or a text prompt before generating.');
      return;
    }
    setShowApiKeyModal(true);
    setPendingGenerate(true);
  }

  function handleApiKeyContinue() {
    setShowApiKeyModal(false);
    setPendingGenerate(false);
    setApiKeyInput('');
    // Auto-close input bar and scroll to video section
    if (typeof setShowInputBar === 'function') {
      setShowInputBar(false);
    }
    // Scroll to video section after a short delay
    setTimeout(() => {
      const videoSection = document.getElementById('video-generation-status');
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
    // Call the real generate handler, passing the API key if needed
    if (typeof handleGenerate === 'function') {
      handleGenerate(apiKeyInput);
    }
  }

  // InlineDropdown: Modern, borderless, always-upward dropdown with CustomDropdown styling
  const InlineDropdown = ({ value, onChange, options = [], placeholder = 'Select', style = {} }) => {
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef(null);
    const dropdownRef = React.useRef(null);

    // Close dropdown on outside click
    React.useEffect(() => {
      if (!open) return;
      function handleClick(e) {
        if (
          buttonRef.current && !buttonRef.current.contains(e.target) &&
          dropdownRef.current && !dropdownRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Find selected label
    const selected = options.find(opt => opt.value === value);

    return (
      <div style={{ position: 'relative', minWidth: 120, ...style }}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(v => !v)}
          style={{
            width: '100%',
            background: '#10141c',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 18px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            outline: open ? '2px solid #3b82f6' : 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.2s',
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {selected ? selected.label : <span style={{ color: '#9ca3af' }}>{placeholder}</span>}
        </button>
        {open && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '110%',
              background: '#18181b',
              borderRadius: '12px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
              zIndex: 100,
              padding: '6px 0',
              marginTop: 4,
              minWidth: 120,
            }}
            role="listbox"
          >
            {options.map(opt => (
              <div
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                onClick={e => {
                  setOpen(false);
                  if (onChange) {
                    // Simulate event for compatibility
                    onChange({ target: { value: opt.value } });
                  }
                }}
                style={{
                  padding: '10px 18px',
                  color: value === opt.value ? '#3b82f6' : '#fff',
                  background: value === opt.value ? 'rgba(59,130,246,0.08)' : 'none',
                  fontWeight: value === opt.value ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  border: 'none',
                  outline: 'none',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.15)')}
                onMouseOut={e => (e.currentTarget.style.background = value === opt.value ? 'rgba(59,130,246,0.08)' : 'none')}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {showInputBar && (
        <div
          style={{
            position: 'fixed',
            bottom: '64px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            maxWidth: '95vw',
            zIndex: 20,
            borderRadius: '20px',
            background: 'linear-gradient(120deg,rgb(30, 39, 55) 0%, #1e2235 60%,rgb(7, 31, 69) 100%)',
            boxShadow: '0 8px 40px 0 rgba(0,0,0,0.45)',
            border: '1.5px solid #232b39',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
            transition: 'background 0.4s'
          }}
        >
          {/* Close Arrow (Right Arrow) */}
          <button
            onClick={() => {
              setShowInputBar(false);
              setShowChatButton(true);
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 16,
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '22px',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'color 0.2s'
            }}
            title="Close"
            aria-label="Close"
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
          >
            {/* Right Arrow SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div
            style={{
              padding: '24px 28px 18px 28px',
              borderRadius: '20px',
              background: 'transparent',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Top row: Upload button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setImageUrlInput("");
                  setShowImageUrlModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(35,43,57,0.95)',
                  padding: '8px 28px',
                  borderRadius: '999px',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#232b39'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(35,43,57,0.95)'}
              >
                <Image size={18} />
                <span>Image URL</span>
              </button>
              <div style={{ flex: 1 }} />
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer',
                  marginRight: '2px',
                  marginLeft: 'auto',
                  padding: '6px',
                  borderRadius: '50%',
                  transition: 'background 0.2s'
                }}
                title="Enhance"
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ display: 'inline-block', transform: 'rotate(45deg)', marginLeft: '-5px' }}>✦</span>
              </button>
            </div>
            {/* Middle row: Input and send */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(35,43,57,0.95)',
                borderRadius: '12px',
                padding: '0 18px',
                marginBottom: '0',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
              }}
            >
              <input
                type="text"
                placeholder="Enter your prompt here"
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#d1d5db',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  padding: '14px 0',
                  fontWeight: 500,
                  letterSpacing: '0.01em'
                }}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                style={{
                  background: 'linear-gradient(135deg,rgb(26, 40, 62) 60%,rgb(29, 8, 79) 100%)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px',
                  marginLeft: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px 0 rgba(59,130,246,0.15)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#4f46e5'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg,rgb(21, 29, 43) 60%,rgb(15, 6, 67) 100%)'}
                onClick={handleGenerateWithApiKey}
              >
                <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24" style={{transform: 'rotate(90deg)'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            {/* Bottom row: Dropdowns and Remix */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              marginTop: '2px',
              marginBottom: 0,
              width: '100%'
            }}>
              <div style={{display:'flex', flexDirection:'column', minWidth:120}}>
                <label style={{color:'#9ca3af', fontSize:13, fontWeight:500, marginBottom:4, marginLeft:2}}>Aspect Ratio</label>
                <InlineDropdown
                  value={selectedAspect}
                  onChange={e => setSelectedAspect(e.target.value)}
                  options={[
                    { value: '16:9', label: '16:9' },
                    { value: '9:16', label: '9:16' },
                    { value: '1:1', label: '1:1' },
                  ]}
                />
              </div>
              <div style={{display:'flex', flexDirection:'column', minWidth:120}}>
                <label style={{color:'#9ca3af', fontSize:13, fontWeight:500, marginBottom:4, marginLeft:2}}>Duration</label>
                <InlineDropdown
                  value={selectedDuration}
                  onChange={e => setSelectedDuration(e.target.value)}
                  options={[
                    { value: '5s', label: '5s' },
                    { value: '10s', label: '10s' },
                  ]}
                />
              </div>
              <div style={{display:'flex', flexDirection:'column', minWidth:120}}>
                <label style={{color:'#9ca3af', fontSize:13, fontWeight:500, marginBottom:4, marginLeft:2}}>Resolution</label>
                <InlineDropdown
                  value={selectedResolution}
                  onChange={e => setSelectedResolution(e.target.value)}
                  options={[
                    { value: '480p', label: '480p' },
                    { value: '720p', label: '720p' },
                  ]}
                />
              </div>
              <div style={{display:'flex', flexDirection:'column', minWidth:120}}>
                <label style={{color:'#9ca3af', fontSize:13, fontWeight:500, marginBottom:4, marginLeft:2}}>Quality</label>
                <InlineDropdown
                  value={selectedQuality}
                  onChange={e => setSelectedQuality(e.target.value)}
                  options={[
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ]}
                />
              </div>
              <div style={{ flex: 1 }} />
            </div>
            {/* Show selected effect if any */}
            {selectedEffect && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#232b39',
                borderRadius: '10px',
                padding: '6px 14px',
                marginBottom: '8px',
                marginTop: '2px',
                color: '#fff',
                fontWeight: 500,
                fontSize: '15px',
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)'
              }}>
                {selectedEffect.effect || selectedEffect.url ? (
                  <img
                    src={selectedEffect.effect || selectedEffect.url}
                    alt={selectedEffect.name || 'Effect'}
                    style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid #23232b' }}
                  />
                ) : null}
                <span>{selectedEffect.name || 'Selected Effect'}</span>
                <button
                  onClick={() => setSelectedEffect(null)}
                  style={{
                    marginLeft: 8,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    fontSize: 18,
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  title="Remove selected effect"
                  aria-label="Remove selected effect"
                  onMouseOver={e => e.currentTarget.style.background = '#2d2d2d'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  ×
                </button>
              </div>
            )}
            {/* Preview uploaded file or image URL */}
            {imageUrl && (
              <div style={{
                marginTop: '12px',
                textAlign: 'left',
                maxWidth: '180px',
                minHeight: '90px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative'
              }}>
                {/* Clear/Cross button */}
                <button
                  onClick={() => setImageUrl("")}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#232b39',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    cursor: 'pointer',
                    zIndex: 2,
                    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)',
                    transition: 'background 0.2s'
                  }}
                  title="Remove preview"
                  aria-label="Remove preview"
                  onMouseOver={e => e.currentTarget.style.background = '#2d2d2d'}
                  onMouseOut={e => e.currentTarget.style.background = '#232b39'}
                >
                  ×
                </button>
                <img
                  src={imageUrl}
                  alt="Image URL Preview"
                  style={{
                    maxWidth: '160px',
                    maxHeight: '90px',
                    borderRadius: '8px',
                    border: '1px solid #23232b',
                    background: '#18181b'
                  }}
                  onError={e => { e.target.onerror = null; e.target.src = ''; e.target.alt = 'Invalid image URL'; }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {/* Small Chat Button (when input bar is closed) */}
      {showChatButton && !showInputBar && (
        <button
          onClick={() => {
            setShowInputBar(true);
            setShowChatButton(false);
          }}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '40px',
            zIndex: 30,
            background: 'linear-gradient(120deg, #232b39 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '54px',
            height: '54px',
            boxShadow: '0 4px 24px 0 rgba(59,130,246,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title="Open Chat"
          aria-label="Open Chat"
        >
          {/* Chat Bubble Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#232b39', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 4px 32px 0 #0008', color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Enter your MuApi API Key</div>
            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 4 }}>
              Don&apos;t have an API key?&nbsp;
              <a href="https://muapi.ai/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                Get it from muapi.ai
              </a>
            </div>
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="API Key"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #333', fontSize: 16, background: '#18181b', color: '#fff' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setApiKeyInput('');
                  setPendingGenerate(false);
                }}
                style={{ padding: '8px 18px', borderRadius: 8, background: '#232b39', color: '#fff', border: '1px solid #444', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
              >Cancel</button>
              <button
                type="button"
                onClick={handleApiKeyContinue}
                style={{ padding: '8px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                disabled={!apiKeyInput.trim()}
              >Continue</button>
            </div>
          </div>
        </div>
      )}
      {/* Image URL Modal */}
      {showImageUrlModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#232b39', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 4px 32px 0 #0008', color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Enter Image URL</div>
            <input
              type="text"
              value={imageUrlInput}
              onChange={e => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #333', fontSize: 16, background: '#18181b', color: '#fff' }}
              autoFocus
              disabled={false}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => {
                  setShowImageUrlModal(false);
                  setImageUrlInput("");
                }}
                style={{ padding: '8px 18px', borderRadius: 8, background: '#232b39', color: '#fff', border: '1px solid #444', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
              >Cancel</button>
              <button
                onClick={() => {
                  if (/^https?:\/\//.test(imageUrlInput)) {
                    setImageUrl(imageUrlInput);
                    setShowImageUrlModal(false);
                  } else {
                    alert('Please enter a valid image URL (http/https)');
                  }
                }}
                style={{ padding: '8px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: imageUrlInput.trim() ? 'pointer' : 'not-allowed', opacity: imageUrlInput.trim() ? 1 : 0.6 }}
                disabled={!imageUrlInput.trim()}
              >Continue</button>
            </div>
          </div>
        </div>
      )}
      {/* Video Popup (minimizable) */}
      {showVideoPopup && !minimizedVideoPopup && videoUrl && (
        <div style={{
          position: 'fixed',
          bottom: '150px',
          right: '40px',
          zIndex: 40,
          background: '#18181b',
          borderRadius: '18px',
          boxShadow: '0 4px 32px 0 #0008',
          padding: 0,
          minWidth: 320,
          minHeight: 180,
          maxWidth: '90vw',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}>
          <button
            onClick={() => setMinimizedVideoPopup(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
              margin: 8,
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            title="Minimize video"
            aria-label="Minimize video"
            onMouseOver={e => e.currentTarget.style.background = '#232b39'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            &#8211;
          </button>
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '0 0 18px 18px',
              background: '#000',
              maxHeight: '50vh',
            }}
          />
        </div>
      )}
      {/* Minimized Video Bubble */}
      {showVideoPopup && minimizedVideoPopup && videoUrl && (
        <button
          onClick={() => setMinimizedVideoPopup(false)}
          style={{
            position: 'fixed',
            bottom: '140px',
            right: '54px',
            zIndex: 41,
            background: '#232b39',
            border: '2px solid #3b82f6',
            borderRadius: '50%',
            width: 54,
            height: 54,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 24px 0 rgba(59,130,246,0.25)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          title="Show video"
          aria-label="Show video"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="16" height="12" rx="3" stroke="#fff" strokeWidth="2" />
            <polygon points="15,12 11,14 11,10" fill="#3b82f6" />
          </svg>
        </button>
      )}
      {/* Example: Show video popup when previewUrl changes (customize as needed) */}
      {/* useEffect(() => {
        if (videoUrl) setShowVideoPopup(true);
      }, [videoUrl]); */}
    </>
  );
};

export default BottomInputBar;