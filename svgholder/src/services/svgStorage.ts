import axios from 'axios';
import type { SvgItem } from '../types/svg';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export class SvgApiService {
  static async getAllSvgs(): Promise<SvgItem[]> {
    try {
      const response = await api.get('/svgs');
      return response.data.data.map(this.transformSvgFromApi);
    } catch (error) {
      console.error('Error fetching SVGs:', error);
      throw new Error('Failed to fetch SVGs');
    }
  }

  static async saveSvg(name: string, description: string, file: File): Promise<SvgItem> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('svgFile', file);

      const response = await api.post('/svgs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return this.transformSvgFromApi(response.data.data);
    } catch (error) {
      console.error('Error saving SVG:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to save SVG');
      }
      throw new Error('Failed to save SVG');
    }
  }

  static async deleteSvg(id: string): Promise<boolean> {
    try {
      await api.delete(`/svgs/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting SVG:', error);
      return false;
    }
  }

  static async getSvgById(id: string): Promise<SvgItem | null> {
    try {
      const response = await api.get(`/svgs/${id}`);
      return this.transformSvgFromApi(response.data.data);
    } catch (error) {
      console.error('Error fetching SVG:', error);
      return null;
    }
  }

  static async updateSvg(id: string, name: string, description: string): Promise<SvgItem | null> {
    try {
      const response = await api.put(`/svgs/${id}`, {
        name,
        description,
      });
      return this.transformSvgFromApi(response.data.data);
    } catch (error) {
      console.error('Error updating SVG:', error);
      return null;
    }
  }

  static async searchSvgs(query: string): Promise<SvgItem[]> {
    try {
      const response = await api.get(`/svgs/search?q=${encodeURIComponent(query)}`);
      return response.data.data.map(this.transformSvgFromApi);
    } catch (error) {
      console.error('Error searching SVGs:', error);
      throw new Error('Failed to search SVGs');
    }
  }

  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.data.success;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  // Transform API response to match frontend interface
  private static transformSvgFromApi(apiSvg: any): SvgItem {
    return {
      id: apiSvg._id,
      name: apiSvg.name,
      description: apiSvg.description,
      content: apiSvg.content,
      uploadDate: apiSvg.createdAt,
      fileSize: apiSvg.fileSize,
    };
  }

  static validateSvgFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) {
      return { isValid: false, error: 'Please select a valid SVG file' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    return { isValid: true };
  }

  static async readSvgFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content.includes('<svg')) {
          resolve(content);
        } else {
          reject(new Error('Invalid SVG content'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}
