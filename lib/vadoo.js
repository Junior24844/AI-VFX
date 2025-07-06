import axios from 'axios';
import FormData from 'form-data';

class VadooAPI {
  constructor(apiKey, baseURL = 'https://api.vadoo.tv/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async generateVideo(request) {
    try {
      let formData;
      // Use Node.js FormData if buffer is provided (backend)
      if (request.image && request.image._isBuffer) {
        formData = new FormData();
        if (request.prompt) formData.append('prompt', request.prompt);
        formData.append('image', request.image, {
          filename: request.imageName || 'image.jpg',
          contentType: request.imageType || 'image/jpeg',
        });
        formData.append('effect', request.effect);
        formData.append('aspect_ratio', request.aspectRatio);
        formData.append('duration', request.duration.toString());
        if (request.style) formData.append('style', request.style);
        if (request.motion) formData.append('motion', request.motion);
        const response = await this.client.post('/generate', formData, {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${process.env.VADOO_API_KEY || ''}`,
          },
        });
        return response.data;
      } else {
        // Browser FormData (frontend)
        formData = new FormData();
        if (request.prompt) formData.append('prompt', request.prompt);
        if (request.image) {
          if (typeof File !== 'undefined' && request.image instanceof File) {
            formData.append('image', request.image);
          } else {
            formData.append('image_url', request.image);
          }
        }
        formData.append('effect', request.effect);
        formData.append('aspect_ratio', request.aspectRatio);
        formData.append('duration', request.duration.toString());
        if (request.style) formData.append('style', request.style);
        if (request.motion) formData.append('motion', request.motion);
        const response = await this.client.post('/generate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error generating video:', error);
      throw new Error('Failed to generate video');
    }
  }

  async getGenerationStatus(id) {
    try {
      const response = await this.client.get(`/generate/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching generation status:', error);
      throw new Error('Failed to fetch generation status');
    }
  }

  async getUserCredits() {
    try {
      const response = await this.client.get('/user/credits');
      return response.data;
    } catch (error) {
      console.error('Error fetching user credits:', error);
      throw new Error('Failed to fetch user credits');
    }
  }

  async getEffects() {
    try {
      const response = await this.client.get('/effects');
      return response.data;
    } catch (error) {
      console.error('Error fetching effects:', error);
      throw new Error('Failed to fetch effects');
    }
  }
}

export const vadooAPI = new VadooAPI(
  process.env.VADOO_API_KEY || '',
  process.env.VADOO_API_URL || 'https://api.vadoo.tv/v1'
);

export default VadooAPI;
