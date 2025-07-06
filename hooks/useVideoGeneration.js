import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useVideoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationId, setGenerationId] = useState(null);
  const [status, setStatus] = useState(null);
  const [credits, setCredits] = useState(0);

  const generateVideo = useCallback(async (request) => {
    setIsGenerating(true);
    setStatus(null);
    try {
      const formData = new FormData();
      if (request.prompt) {
        formData.append('prompt', request.prompt);
      }
      if (request.image) {
        formData.append('image', request.image);
      }
      formData.append('effect', request.effect);
      formData.append('aspectRatio', request.aspectRatio);
      formData.append('duration', request.duration.toString());
      if (request.style) {
        formData.append('style', request.style);
      }
      if (request.motion) {
        formData.append('motion', request.motion);
      }
      const response = await axios.post('/api/generate-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = response.data;
      setGenerationId(result.id);
      setStatus(result);
      toast.success('Video generation started!');
      // Start polling for status
      pollStatus(result.id);
      return result;
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video');
      setIsGenerating(false);
      throw error;
    }
  }, []);

  const pollStatus = useCallback(async (id) => {
    const poll = async () => {
      try {
        const response = await axios.get(`/api/generate-status?id=${id}`);
        const newStatus = response.data;
        setStatus(newStatus);
        if (newStatus.status === 'completed') {
          setIsGenerating(false);
          toast.success('Video generation completed!');
          return;
        }
        if (newStatus.status === 'failed') {
          setIsGenerating(false);
          toast.error(newStatus.error_message || 'Video generation failed');
          return;
        }
        // Continue polling if still processing
        if (newStatus.status === 'processing' || newStatus.status === 'pending') {
          setTimeout(poll, 3000); // Poll every 3 seconds
        }
      } catch (error) {
        console.error('Error polling status:', error);
        setIsGenerating(false);
        toast.error('Failed to check video status');
      }
    };
    poll();
  }, []);

  const fetchCredits = useCallback(async () => {
    try {
      const response = await axios.get('/api/user-credits');
      setCredits(response.data.credits);
      return response.data;
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error('Failed to fetch credits');
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setIsGenerating(false);
    setGenerationId(null);
    setStatus(null);
  }, []);

  return {
    generateVideo,
    isGenerating,
    generationId,
    status,
    credits,
    fetchCredits,
    resetGeneration,
  };
};
