'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play,
  Image,
  Crown,
  Home, 
  User, 
  Calendar, 
  Bot, 
  Video, 
  FolderOpen, 
  Moon, 
  LogOut, 
  CreditCard, 
  HelpCircle, 
  Bell 
} from 'lucide-react';
import './globals.css'; // if not already imported
import BottomInputBar from '../components/BottomInputBar';


const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState('AI Effects');
  const [showInputBar, setShowInputBar] = useState(true);
  const [showChatButton, setShowChatButton] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");

  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: FolderOpen, label: 'My Projects' },
    { icon: Calendar, label: 'Calendar' },
    { icon: User, label: 'Profile' },
    { icon: Bot, label: 'AI Apps' },
    { icon: Video, label: 'Video Editor' },
  ];

  const accountItems = [
    { icon: Bell, label: 'Activity' },
    { icon: HelpCircle, label: 'Support' },
    { icon: CreditCard, label: 'Subscription' },
    { icon: LogOut, label: 'Logout' },
    { icon: Moon, label: 'Dark Mode' },
  ];

  const filters = [
    { name: "AI Effects", icon: "⭐" },
    { name: "Motion Controls", icon: "🎬" },
    { name: "VFX", icon: "⭐" }
  ];

  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // <-- NEW: for image URL input
  const [dragActive, setDragActive] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedAspect, setSelectedAspect] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const fileInputRef = useRef(null);

  // Add refs for each section
  const aiEffectsRef = useRef(null);
  const motionControlsRef = useRef(null);
  const vfxControlsRef = useRef(null);

  // Scroll to section when filter is selected
  useEffect(() => {
    if (activeFilter === 'AI Effects' && aiEffectsRef.current) {
      aiEffectsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeFilter === 'Motion Controls' && motionControlsRef.current) {
      motionControlsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeFilter === 'VFX' && vfxControlsRef.current) {
      vfxControlsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeFilter]);

  // File validation helper
  const isValidFile = (file) => {
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
    ];
    return validTypes.includes(file.type);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setUploadedFile(null);
      setPreviewUrl(null);
      if (file) alert('Please upload a valid image or video file.');
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        setUploadedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setUploadedFile(null);
        setPreviewUrl(null);
        alert('Please upload a valid image or video file.');
      }
    }
  };

  // Handle video generation
  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText })
      });
      const data = await response.json();
      if (data && data.videoUrl) {
        setPreviewUrl(data.videoUrl);
      } else {
        alert('Failed to generate video.');
      }
    } catch (error) {
      alert('Error generating video.');
    }
  };

  // Pixverse Effects
  const pixverseEffects = [
    
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Kiss_Me_AI.webp', name: 'Kiss Me AI' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Kiss.webp', name: 'Kiss' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Venom.webp', name: 'Venom' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Hulk_.webp', name: 'Hulk' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Muscle_Surge.webp', name: 'Muscle Surge' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/The_Tiger_Touch.webp', name: 'The Tiger Touch' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Anything_Robot.webp', name: 'Anything, Robot' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Warmth_of_Jesus.webp', name: 'Warmth of Jesus' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Holy_Wings.webp', name: 'Holy Wings' },
    { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Microwave.webp', name: 'Microwave' },
  ];

  // Motion Controls (from utility.js)
  const motionControls = [
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/360+Orbit.webp', 
      name: '360 Orbit',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/aaa3e820-5d94-4612-9488-0c9a1b2f5843/adapter_model.safetensors",
      trigger_word: "0rb4it 360 degree orbit",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Action+Run.webp', 
      name: 'Hero Run',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/36b9edf7-31d7-47d3-ad3b-e166fb3a9842/adapter_model.safetensors",
      trigger_word: "4ct3ion Action Run",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Arc.webp', 
      name: 'Arc Shot',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/a5949ee3-61ea-4a18-bd4d-54c855f5401c/adapter_model.safetensors",
      trigger_word: "34Ar2c arc the camera moves in a smooth curve around",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Bullet+Time.webp', 
      name: 'Matrix Shot',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/219ad5ad-8f23-48dc-b098-b8e6d9fbe6c0/adapter_model.safetensors",
      trigger_word: "b4ll3t t1m3 bullet time shot",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Car+Chasing.webp', 
      name: 'Car Chase',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/8b36b7fe-0a0b-4849-b0ed-d9a51ff0cc85/adapter_model.safetensors",
      trigger_word: "c4r ch4s3 car chase",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Down.webp', 
      name: 'Crane Down',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/f26db0b7-1c26-4587-b2b5-1cfd0c51c5b3/adapter_model.safetensors",
      trigger_word: "cr4n3 crane down camera motion",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Over+The+Head.webp', 
      name: 'Crane Overhead',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/9393f8f4-abe6-4aa7-ba01-0b62e1507feb/adapter_model.safetensors",
      trigger_word: "cr4n3 crane over the head movement",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Up.webp', 
      name: 'Crane Up',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/07c5e22b-7028-437c-9479-6eb9a50cf993/adapter_model.safetensors",
      trigger_word: "cr4n3 crane up effect",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crash+Zoom+In.webp', 
      name: 'Crash Zoom In',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/34a80641-4702-4c1c-91bf-c436a59c79cb/adapter_model.safetensors",
      trigger_word: "cr34sh crash zoom in effect",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crash+Zoom+Out.webp', 
      name: 'Crash Zoom Out',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/44c05ca1-422d-4cd4-8508-acadb6d0248c/adapter_model.safetensors",
      trigger_word: "cr34sh crash zoom out effect",
      input_type: "i2v",
    },
  ];

  // VFX Controls (from utility.json)
  const vfxControls = [
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Levitation.webp', 
      name: 'Levitate',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/29068e70-dc05-4cfa-9b68-305d45645b00/adapter_model.safetensors",
      trigger_word: "lev1tate2_it0 levitate effect",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Disintegration.webp', 
      name: 'Disintegration',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/971ea00a-f708-44ce-83cf-e54006ea1f76/adapter_model.safetensors",
      trigger_word: "d1s1nt34gration disintegration effect",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Flying.webp', 
      name: 'Flying',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5dc604ed-1e2f-44d5-9437-7f56aa6205ac/adapter_model.safetensors",
      trigger_word: "f1y1ng smooth gliding flight",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Car+Explosion.webp', 
      name: 'Car Explosion',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/efea3aa4-32e8-4523-af44-7e59d731d453/adapter_model.safetensors",
      trigger_word: "c3r exp356l0sion the car explodes bursting into flames and debris",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Tornado.webp', 
      name: 'Tornado',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/1907141a-c058-47d4-837e-078983a6f710/adapter_model.safetensors",
      trigger_word: "t0r54d0 realistic tornado",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Electricity.webp', 
      name: 'Electricity',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/9aad6061-a858-43df-8202-b44f036e04c2/adapter_model.safetensors",
      trigger_word: "e13c7r1c electricity effect",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Huge+Explosion.webp', 
      name: 'Huge Explosion',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/dcdb7020-02b4-42cb-b623-16902db65e90/adapter_model.safetensors",
      trigger_word: "3xp105ion huge explosion",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Decay+Time-Lapse.webp', 
      name: 'Decay Time-Lapse',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/6b6f64dc-ac14-44b2-b91c-a510cb7f7f32/adapter_model.safetensors",
      trigger_word: "d3c4y decay time-lapse begins",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Tsunami.webp', 
      name: 'Tsunami',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/64e58850-45cb-43e0-864b-3a3bc259afa7/adapter_model.safetensors",
      trigger_word: "t5un@m1 realistic tsunami",
      input_type: "t2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Fire.webp', 
      name: 'Fire',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c45274ad-bc5d-41f2-acac-64b8cb8c3bf1/adapter_model.safetensors",
      trigger_word: "[r3al_f1re]",
      input_type: "t2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Robotic+Face+Reveal.webp', 
      name: 'Robotic Face Reveal',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5e4b881d-6a1e-4cc7-b827-20b382248d41/adapter_model.safetensors",
      trigger_word: "r8b8t1c robotic face reveal",
      input_type: "i2v",
    },
    { 
      url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Building+Explosion.webp', 
      name: 'Building Explosion',
      path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/77a2daa2-c255-4ea8-9581-594853a6d96e/adapter_model.safetensors",
      trigger_word: "b32ldi4ng exp39lsion the building explodes in a massive blast",
      input_type: "i2v",
    },
  ];

  // --- Video Generation Logic (from generate/page.js) ---
  const [status, setStatus] = useState('idle');
  const [requestId, setRequestId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [log, setLog] = useState([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const isMountedRef = useRef(true);
  const pollTimeoutRef = useRef(null);
  const API_URL = '/api/proxy-muapi'; // Use local proxy endpoint
  const RESULT_URL = 'https://api.muapi.ai/api/v1/predictions';
  const MAX_POLL_ATTEMPTS = 180; // Increased from 60 to 180 (3 minutes)

  const addLog = useCallback((message) => {
    if (isMountedRef.current) {
      setLog(prevLog => [...prevLog, message]);
    }
  }, []);

  const handleVideoGenerate = useCallback(() => {
    addLog('Opening API key modal for video generation...');
    setShowApiKeyModal(true);
  }, [addLog]);

  const pollForResult = useCallback(async (reqId, userApiKey) => {
    const pollHeaders = { 'x-api-key': userApiKey };
    // Use proxy endpoint for polling
    const pollUrl = `/api/proxy-muapi?id=${reqId}`;
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
          // --- PATCH: check both data.video?.url and data.output ---
          let videoUrl = data.video?.url;
          if (!videoUrl && data.output && typeof data.output === 'string') {
            videoUrl = data.output;
          }
          if (videoUrl) {
            if (isMountedRef.current) {
              setStatus('completed');
              setVideoUrl(videoUrl);
              addLog(`Task completed in ${((Date.now()-start)/1000).toFixed(1)}s. Video URL: ${videoUrl}`);
            }
            return;
          } else {
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

  const startGenerationWithKey = useCallback(async (userApiKey) => {
    // --- Video Generation Logic (moved from render body) ---
    // Helper to map aspect and resolution to MuApi size
    function getMuApiSize(aspect, resolution) {
      // Ensure aspect is a string and trim it
      if (typeof aspect === 'string') {
        aspect = aspect.trim();
      } else {
        // If aspect is not a string or is null/undefined, default to 16:9
        aspect = '16:9';
      }
      // Accept both 16:9 and 9:16, fallback to 832*480
      if (aspect === '16:9') return '832*480';
      if (aspect === '9:16') return '480*832';
      return '832*480';
    }
    let size = getMuApiSize(selectedAspect, selectedResolution);
    // Ensure size is exactly one of the allowed values
    if (size !== '832*480' && size !== '480*832') {
      size = '832*480';
    }
    const videoPayload = {
      prompt: inputText, // user input only
      name: selectedEffect?.name, // user-selected effect only
      aspect_ratio: selectedAspect, // user-selected aspect only
      size, // always valid value
      quality: selectedQuality, // user-selected quality only
      duration: parseInt(selectedDuration), // user-selected duration only
    };
    // Use imageUrl for image input
    if (!imageUrl || !/^https?:\/\//.test(imageUrl)) {
      setError('Please provide a valid image URL (http/https) using the image button.');
      return;
    }
    videoPayload.image_url = imageUrl;
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
      addLog('Payload being sent: ' + JSON.stringify(videoPayload, null, 2));
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': userApiKey,
        },
        body: JSON.stringify(videoPayload),
      });
      addLog('API response status: ' + res.status);
      if (!res.ok) {
        const errorText = await res.text();
        addLog('API error response: ' + errorText);
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
      pollForResult(reqId, userApiKey);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      setStatus('error');
      addLog(`Error: ${err.message}`);
      if (err.stack) addLog('Stack trace: ' + err.stack);
    }
  }, [addLog, inputText, selectedEffect, selectedAspect, selectedResolution, selectedQuality, selectedDuration, imageUrl, pollForResult]);

  // --- Video Generation Modal Popup State ---
  const [showVideoModal, setShowVideoModal] = useState(false);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // Show modal when generation starts
  useEffect(() => {
    if ((status === 'submitting' || status === 'polling') && !showVideoModal) {
      setShowVideoModal(true);
    }
    // Hide modal if user resets
    if (status === 'idle' && showVideoModal) {
      setShowVideoModal(false);
    }
  }, [status]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Video Generation Modal Popup */}
      {showVideoModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#232b39', padding: 32, borderRadius: 16, minWidth: 340, minHeight: 220, boxShadow: '0 4px 32px 0 #0008', color: '#fff', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', position: 'relative' }}>
            {/* Close button */}
            <button
              onClick={() => {
                setShowVideoModal(false);
                setStatus('idle');
                setError('');
                setLog([]);
                setVideoUrl('');
                setRequestId(null);
                setInputText('');
                setImageUrl('');
                setUploadedFile(null);
                setPreviewUrl(null);
                setSelectedEffect(null);
              }}
              style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              title="Close"
              aria-label="Close"
              onMouseOver={e => e.currentTarget.style.background = '#2d2d2d'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >×</button>
            {/* Loading or Video */}
            {(status === 'submitting' || status === 'polling') && (
              <>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
                  <span role="img" aria-label="hourglass">⏳</span> Generating your video...
                </div>
                <div style={{ width: 320, maxWidth: '90vw', height: 8, background: '#18181b', borderRadius: 8, margin: '0 auto', overflow: 'hidden' }}>
                  <div className="loading-bar" style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#60a5fa 0%,#3b82f6 100%)', animation: 'loadingBarAnim 1.2s linear infinite' }} />
                </div>
                <style>{`
                  @keyframes loadingBarAnim {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
              </>
            )}
            {status === 'completed' && videoUrl && (
              <>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
                  🎉 Your video is ready!
                </div>
                <video src={videoUrl} controls style={{ maxWidth: 400, maxHeight: 300, borderRadius: 10, marginBottom: 12, background: '#000' }} />
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <a href={videoUrl} download target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, textDecoration: 'none', cursor: 'pointer' }}>Download</a>
                  <button
                    onClick={() => {
                      setShowVideoModal(false);
                      setStatus('idle');
                      setError('');
                      setLog([]);
                      setVideoUrl('');
                      setRequestId(null);
                      setInputText('');
                      setImageUrl('');
                      setUploadedFile(null);
                      setPreviewUrl(null);
                      setSelectedEffect(null);
                    }}
                    style={{ padding: '8px 18px', borderRadius: 8, background: '#232b39', color: '#fff', border: '1px solid #444', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                  >Close</button>
                </div>
              </>
            )}
            {status === 'error' && error && (
              <div style={{ color: '#f87171', marginTop: 12, textAlign: 'center' }}>
                <b>Error:</b> {error}
              </div>
            )}
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
            {requestId && (
              <div style={{ margin: '10px 0' }}>
                <b>Request ID:</b> {requestId}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Main Content */}
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#111' }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #2d2d2d',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>V</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>vadoo AI</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 24px',
          borderBottom: '1px solid #2d2d2d',
          overflowX: 'auto',
          width: '100%'
        }}>
          {filters.map((filter, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(filter.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: `1px solid ${activeFilter === filter.name ? '#3b82f6' : '#2d2d2d'}`,
                backgroundColor: activeFilter === filter.name ? '#1a1a1a' : 'transparent',
                color: activeFilter === filter.name ? 'white' : '#9ca3af',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <span>{filter.icon}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        {/* AI Effects Grid */}
        <div ref={aiEffectsRef} style={{ flex: 1, padding: '24px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '18px' }}>⭐</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>AI Effects</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              maxWidth: '1200px'
            }}
          >
            {pixverseEffects.map((effect, index) => (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedEffect && selectedEffect.name === effect.name ? '#3b82f6' : '#1a1a1a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: selectedEffect && selectedEffect.name === effect.name ? '2px solid #3b82f6' : '1px solid #2d2d2d',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '200px'
                }}
                onClick={() => setSelectedEffect(effect)}
              >
                <div style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px 12px 0 0',
                  overflow: 'hidden',
                  borderBottom: '1px solid #2d2d2d',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={effect.effect}
                    alt={effect.name || 'Effect'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Play size={20} color="white" />
                    </div>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#fff',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: '12px 0',
                  padding: '0 12px',
                  fontWeight: '500'
                }}>
                  {effect.name || 'No Name'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Motion Controls Grid */}
        <div ref={motionControlsRef} style={{ flex: 1, padding: '24px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '18px' }}>🎬</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>Motion Controls</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              maxWidth: '1200px'
            }}
          >
            {motionControls.map((control, index) => (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedEffect && selectedEffect.name === control.name ? '#3b82f6' : '#1a1a1a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: selectedEffect && selectedEffect.name === control.name ? '2px solid #3b82f6' : '1px solid #2d2d2d',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '200px'
                }}
                onClick={() => setSelectedEffect(control)}
              >
                <div style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px 12px 0 0',
                  overflow: 'hidden',
                  borderBottom: '1px solid #2d2d2d',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={control.url}
                    alt={control.name || 'Motion Control'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#fff',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: '12px 0',
                  padding: '0 12px',
                  fontWeight: '500'
                }}>
                  {control.name || 'No Name'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* VFX Controls Grid */}
        <div ref={vfxControlsRef} style={{ flex: 1, padding: '24px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '18px' }}>⭐</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>VFX Controls</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              maxWidth: '1200px'
            }}
          >
            {vfxControls.map((vfx, index) => (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedEffect && selectedEffect.name === vfx.name ? '#3b82f6' : '#1a1a1a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: selectedEffect && selectedEffect.name === vfx.name ? '2px solid #3b82f6' : '1px solid #2d2d2d',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '200px'
                }}
                onClick={() => setSelectedEffect(vfx)}
              >
                <div style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px 12px 0 0',
                  overflow: 'hidden',
                  borderBottom: '1px solid #2d2d2d',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={vfx.url}
                    alt={vfx.name || 'VFX Control'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#fff',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: '12px 0',
                  padding: '0 12px',
                  fontWeight: '500'
                }}>
                  {vfx.name || 'No Name'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Input Bar */}
        <BottomInputBar
          showInputBar={showInputBar}
          setShowInputBar={setShowInputBar}
          showChatButton={showChatButton}
          setShowChatButton={setShowChatButton}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          inputText={inputText}
          setInputText={setInputText}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          selectedAspect={selectedAspect}
          setSelectedAspect={setSelectedAspect}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleGenerate={startGenerationWithKey}
          selectedEffect={selectedEffect}
          selectedResolution={selectedResolution}
          setSelectedResolution={setSelectedResolution}
          selectedQuality={selectedQuality}
          setSelectedQuality={setSelectedQuality}
        />
        {/* Always show chat bubble button */}
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
            display: showInputBar ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title="Open Chat"
          aria-label="Open Chat"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Video Generation Modal and Log */}
        {showApiKeyModal && (
          <div style={{
            position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ background: '#232b39', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 4px 32px 0 #0008', color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Enter your MuApi API Key</div>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="API Key"
                style={{ padding: 10, borderRadius: 8, border: '1px solid #333', fontSize: 16, background: '#18181b', color: '#fff' }}
                autoFocus
                disabled={status === 'submitting' || status === 'polling'}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => {
                    setShowApiKeyModal(false);
                    setApiKeyInput('');
                  }}
                  style={{ padding: '8px 18px', borderRadius: 8, background: '#232b39', color: '#fff', border: '1px solid #444', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                  disabled={status === 'submitting' || status === 'polling'}
                >Cancel</button>
                <button
                  onClick={() => {
                    setShowApiKeyModal(false);
                    startGenerationWithKey(apiKeyInput);
                  }}
                  style={{ padding: '8px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: (!apiKeyInput.trim() || status === 'submitting' || status === 'polling') ? 'not-allowed' : 'pointer', opacity: (!apiKeyInput.trim() || status === 'submitting' || status === 'polling') ? 0.6 : 1 }}
                  disabled={!apiKeyInput.trim() || status === 'submitting' || status === 'polling'}
                >Continue</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;