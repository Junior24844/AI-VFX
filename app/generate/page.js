// app/generate/page.js
'use client';

import React, { useState, useCallback, useRef } from 'react';

const API_URL = 'https://api.muapi.ai/api/v1/generate_wan_ai_effects';
const RESULT_URL = 'https://api.muapi.ai/api/v1/predictions';
const MAX_POLL_ATTEMPTS = 60; // Maximum polling attempts (60 seconds)

export default function GeneratePage() {
  const [status, setStatus] = useState('idle');
  const [requestId, setRequestId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [log, setLog] = useState([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  // Use ref to track if component is still mounted
  const isMountedRef = useRef(true);
  const pollTimeoutRef = useRef(null);

  const payload = {
    prompt: 'a Mercedes bench car',
    image_url: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/325013990791/fa5a980c-5c3c-42c3-87a3-578976ffd8a6.jpg',
    name: 'Car Explosion',
    aspect_ratio: '16:9',
    resolution: '480p',
    quality: 'medium',
    duration: 5,
  };

  const addLog = useCallback((message) => {
    if (isMountedRef.current) {
      setLog(prevLog => [...prevLog, message]);
    }
  }, []);

  const handleGenerate = useCallback(() => {
    setShowApiKeyModal(true);
  }, []);

  const startGenerationWithKey = useCallback(async (userApiKey) => {
    if (!userApiKey.trim()) {
      setError('API key is required');
      return;
    }

    setStatus('submitting');
    setLog([`Submitting task to MuApi...`]);
    setError('');
    setVideoUrl('');
    setRequestId(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': userApiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      addLog('API raw response: ' + JSON.stringify(data));
      if (!data.request_id) {
        setError('Invalid response: missing request_id. ' + (data.error || JSON.stringify(data)));
        throw new Error('Invalid response: missing request_id');
      }
      const reqId = data.request_id;
      setRequestId(reqId);
      addLog(`Task submitted. Request ID: ${reqId}`);
      setStatus('polling');
      
      // Start polling for result
      pollForResult(reqId, userApiKey);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      setStatus('error');
      addLog(`Error: ${err.message}`);
    }
  }, [addLog]);

  const pollForResult = useCallback(async (reqId, userApiKey) => {
    const pollHeaders = { 'x-api-key': userApiKey };
    const pollUrl = `${RESULT_URL}/${reqId}/result`;
    const start = Date.now();
    let tries = 0;

    const poll = async () => {
      if (!isMountedRef.current) return;

      tries++;
      addLog(`Polling attempt #${tries}...`);

      try {
        const res = await fetch(pollUrl, { headers: pollHeaders });
        
        if (!res.ok) {
          throw new Error(`Poll error: ${res.status}`);
        }

        const data = await res.json();
        
        if (!data.status) {
          throw new Error('Invalid response: missing status');
        }
        const taskStatus = data.status;
        if (taskStatus === 'completed') {
          addLog('Completed response: ' + JSON.stringify(data));
          const videoUrl = data.video?.url;
          if (videoUrl) {
            if (isMountedRef.current) {
              setStatus('completed');
              setVideoUrl(videoUrl);
              addLog(`Task completed in ${((Date.now()-start)/1000).toFixed(1)}s. Video URL: ${videoUrl}`);
            }
            return;
          } else {
            // Video not ready yet, treat as failure and offer retry
            addLog('Completed but video URL missing.');
            setStatus('failed');
            setError('Video generation failed: No video URL received. Would you like to retry?');
            return;
          }
        } else if (taskStatus === 'failed') {
          if (isMountedRef.current) {
            setStatus('failed');
            const errorMsg = data.error || 'Task failed';
            setError(errorMsg);
            addLog(`Task failed: ${errorMsg}`);
          }
          return;
        } else {
          addLog(`Status: ${taskStatus}`);
        }

        // Continue polling if not completed/failed and under max attempts
        if (tries < MAX_POLL_ATTEMPTS && isMountedRef.current) {
          pollTimeoutRef.current = setTimeout(poll, 1000);
        } else if (tries >= MAX_POLL_ATTEMPTS && isMountedRef.current) {
          setStatus('timeout');
          setError('Polling timeout: Maximum attempts reached');
          addLog('Polling timeout: Maximum attempts reached');
        }
      } catch (err) {
        console.error('Polling error:', err);
        if (isMountedRef.current) {
          setError(err.message);
          setStatus('error');
          addLog(`Polling error: ${err.message}`);
        }
      }
    };

    poll();
  }, [addLog]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#18181b', color: '#fff', borderRadius: 16 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>MuApi Demo</h2>
      <p>This page demonstrates how to call the MuApi endpoint and poll for results.</p>
      
      <button 
        onClick={handleGenerate} 
        disabled={status === 'submitting' || status === 'polling'}
        style={{ 
          margin: '18px 0', 
          padding: '10px 28px', 
          borderRadius: 8, 
          background: (status === 'submitting' || status === 'polling') ? '#6b7280' : '#3b82f6', 
          color: '#fff', 
          border: 'none', 
          fontWeight: 600, 
          fontSize: 16, 
          cursor: (status === 'submitting' || status === 'polling') ? 'not-allowed' : 'pointer' 
        }}
      >
        {status === 'submitting' || status === 'polling' ? 'Processing...' : 'Generate AI Effect'}
      </button>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', 
          background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ 
            background: '#232b39', padding: 32, borderRadius: 16, minWidth: 320, 
            boxShadow: '0 4px 32px 0 #0008', color: '#fff', 
            display: 'flex', flexDirection: 'column', gap: 16 
          }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              Enter your MuApi API Key
            </div>
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="API Key"
              style={{ 
                padding: 10, borderRadius: 8, border: '1px solid #333', 
                fontSize: 16, background: '#18181b', color: '#fff' 
              }}
              autoFocus
              disabled={status === 'submitting' || status === 'polling'}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setApiKeyInput('');
                }}
                style={{ 
                  padding: '8px 18px', borderRadius: 8, background: '#232b39', 
                  color: '#fff', border: '1px solid #444', fontWeight: 500, 
                  fontSize: 15, cursor: 'pointer' 
                }}
                disabled={status === 'submitting' || status === 'polling'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  startGenerationWithKey(apiKeyInput);
                }}
                style={{ 
                  padding: '8px 18px', borderRadius: 8, background: '#3b82f6', 
                  color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, 
                  cursor: (!apiKeyInput.trim() || status === 'submitting' || status === 'polling') ? 'not-allowed' : 'pointer',
                  opacity: (!apiKeyInput.trim() || status === 'submitting' || status === 'polling') ? 0.6 : 1
                }}
                disabled={!apiKeyInput.trim() || status === 'submitting' || status === 'polling'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {requestId && (
        <div style={{ margin: '10px 0' }}>
          <b>Request ID:</b> {requestId}
        </div>
      )}

      {videoUrl && (
        <div style={{ margin: '18px 0' }}>
          <b>Result Video:</b><br />
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>
            {videoUrl}
          </a><br />
          <video src={videoUrl} controls style={{ maxWidth: 400, marginTop: 10, borderRadius: 8 }} />
        </div>
      )}

      {error && (
        <div style={{ color: '#f87171', margin: '10px 0' }}>
          <b>Error:</b> {error}
        </div>
      )}

      {/* Retry button if failed due to no video URL */}
      {status === 'failed' && error && error.includes('retry') && (
        <div style={{ margin: '16px 0' }}>
          <button
            onClick={() => {
              setError('');
              setStatus('idle');
              setLog([]);
              setVideoUrl('');
              setRequestId(null);
              setShowApiKeyModal(true);
            }}
            style={{ padding: '10px 28px', borderRadius: 8, background: '#f87171', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
          >
            Retry Generation
          </button>
        </div>
      )}

      <div style={{ 
        marginTop: 18, background: '#232b39', borderRadius: 8, 
        padding: 12, fontSize: 14, minHeight: 80 
      }}>
        <b>Log:</b>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {log.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </div>

      <div style={{ marginTop: 32, fontSize: 13, color: '#a3a3a3' }}>
        <b>Note:</b> For production, store your API key securely in environment variables.<br />
        This demo uses <code>fetch</code> and works client-side for demonstration.<br />
        For server-side, use <code>process.env</code> and <code>fetch</code> or <code>axios</code> in API routes or server components.
      </div>
    </div>
  );
}