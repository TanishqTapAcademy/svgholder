import { useState, useRef } from 'react';
import { SvgApiService } from '../services/svgStorage';

const SvgImporter = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = async (file: File) => {
    const validation = SvgApiService.validateSvgFile(file);
    if (!validation.isValid) {
      setMessage({ type: 'error', text: validation.error || 'Invalid file' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    // Generate preview
    try {
      const content = await SvgApiService.readSvgFile(file);
      setPreviewContent(content);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to read SVG file' });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !selectedFile) {
      setMessage({ type: 'error', text: 'Please fill in all fields and select a file' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await SvgApiService.saveSvg(formData.name.trim(), formData.description.trim(), selectedFile);
      setMessage({ type: 'success', text: 'SVG uploaded successfully!' });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setSelectedFile(null);
      setPreviewContent(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload SVG' 
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-64 right-24 w-32 h-32 bg-gradient-to-br from-cyan-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-purple-200/50 rounded-full text-purple-700 text-sm font-medium">
              📁 Upload & Organize
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Import SVG
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload and organize your SVG files with beautiful descriptions
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-purple-100/50">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-6">
            <label className="block text-lg font-semibold text-gray-800">
              ✨ SVG File *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-purple-400 bg-purple-50/50 scale-105'
                  : selectedFile
                  ? 'border-green-400 bg-green-50/50'
                  : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="text-green-500">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      📊 {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors duration-300"
                  >
                    🗑️ Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-purple-400">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="h-10 w-10" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 mb-2">
                      <span className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full inline-block">
                      📁 SVG files only, up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-3">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-800">
              🏷️ Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/70 border border-purple-200/50 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-white/80"
              placeholder="Enter a creative name for your SVG"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <label htmlFor="description" className="block text-lg font-semibold text-gray-800">
              📝 Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-6 py-4 bg-white/70 border border-purple-200/50 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-white/80 resize-none"
              placeholder="Describe your SVG file and its purpose..."
              required
            />
          </div>

          {/* Preview */}
          {previewContent && (
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                👁️ Preview
              </label>
              <div className="border-2 border-purple-200/50 rounded-2xl p-8 bg-gradient-to-br from-purple-50/30 to-cyan-50/30 flex justify-center items-center min-h-[250px] shadow-lg">
                <div 
                  className="w-full h-56 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ 
                    __html: previewContent.replace(
                      /<svg([^>]*)>/,
                      '<svg$1 style="max-width: 100%; max-height: 100%; width: auto; height: auto;">'
                    )
                  }}
                />
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-6 rounded-2xl shadow-lg ${
              message.type === 'success' 
                ? 'bg-green-50/80 text-green-800 border-2 border-green-200/50 backdrop-blur-sm' 
                : 'bg-red-50/80 text-red-800 border-2 border-red-200/50 backdrop-blur-sm'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-semibold">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading || !selectedFile || !formData.name.trim() || !formData.description.trim()}
              className={`px-12 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform ${
                loading || !selectedFile || !formData.name.trim() || !formData.description.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 hover:scale-105 shadow-2xl hover:shadow-purple-500/25'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mr-4"></div>
                  </div>
                  <span>✨ Uploading Magic...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>🚀 Upload SVG</span>
                  <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default SvgImporter;
