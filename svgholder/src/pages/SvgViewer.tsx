import { useState, useEffect } from 'react';
import { SvgApiService } from '../services/svgStorage';
import type { SvgItem } from '../types/svg';

const SvgViewer = () => {
  const [svgs, setSvgs] = useState<SvgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSvg, setSelectedSvg] = useState<SvgItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    loadSvgs();
  }, []);

  const loadSvgs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SvgApiService.getAllSvgs();
      setSvgs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SVGs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSvgs();
      return;
    }

    try {
      setLoading(true);
      const results = await SvgApiService.searchSvgs(searchQuery.trim());
      setSvgs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SVG?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const success = await SvgApiService.deleteSvg(id);
      if (success) {
        setSvgs(prev => prev.filter(svg => svg.id !== id));
        if (selectedSvg?.id === id) {
          setSelectedSvg(null);
        }
      } else {
        alert('Failed to delete SVG');
      }
    } catch (err) {
      alert('Failed to delete SVG');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateForGrouping = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const groupSvgsByDate = (svgs: SvgItem[]) => {
    const groups: { [key: string]: SvgItem[] } = {};
    
    svgs.forEach(svg => {
      const date = new Date(svg.uploadDate);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(svg);
    });
    
    // Sort groups by date (newest first)
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, svgs]) => ({
        dateKey,
        date: new Date(dateKey),
        svgs: svgs.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleCopySvg = async (svgContent: string) => {
    try {
      await navigator.clipboard.writeText(svgContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy SVG:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = svgContent;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading && svgs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your SVG collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-purple-200/50 rounded-full text-purple-700 text-sm font-medium">
              🎨 Your Creative Collection
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SVG Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse, search, and manage your uploaded SVG files with style
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search SVGs by name or description..."
                    className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-purple-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 placeholder-gray-500 shadow-lg transition-all duration-300 hover:bg-white/80"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white rounded-2xl hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Search
                </button>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      loadSvgs();
                    }}
                    className="px-6 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-2xl hover:bg-white/80 hover:text-gray-800 transition-all duration-300 shadow-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl shadow-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-red-800 font-medium">{error}</p>
                  <button
                    onClick={loadSvgs}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300 text-sm font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SVG Grid */}
        {svgs.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No SVGs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try a different search term or browse all SVGs' : 'Start building your collection by uploading your first SVG'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => window.location.href = '/svg-importer'}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Upload Your First SVG
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {groupSvgsByDate(svgs).map((group) => (
              <div key={group.dateKey} className="space-y-6">
                {/* Date Header */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {formatDateForGrouping(group.dateKey)}
                    </h2>
                    <span className="text-lg text-gray-500 font-medium">
                      ({group.svgs.length} {group.svgs.length === 1 ? 'SVG' : 'SVGs'})
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                </div>

                {/* SVG Grid for this date */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.svgs.map((svg, index) => (
              <div 
                key={svg.id} 
                className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100/50"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* SVG Preview */}
                <div className="p-6 border-b border-purple-100/50">
                  <div 
                    className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-purple-50/50 to-cyan-50/50 rounded-xl cursor-pointer overflow-hidden group-hover:from-purple-100/50 group-hover:to-cyan-100/50 transition-all duration-300"
                    onClick={() => setSelectedSvg(svg)}
                    dangerouslySetInnerHTML={{ 
                      __html: svg.content.replace(
                        /<svg([^>]*)>/,
                        '<svg$1 style="max-width: 100%; max-height: 100%; width: auto; height: auto;">'
                      )
                    }}
                  />
                </div>

                {/* SVG Info */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2 truncate text-lg group-hover:text-purple-600 transition-colors duration-300">{svg.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{svg.description}</p>
                  
                  <div className="text-xs text-gray-500 space-y-2 mb-6">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(svg.uploadDate)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {formatFileSize(svg.fileSize)}
                    </div>
                  </div>

                                          {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedSvg(svg)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              const blob = new Blob([svg.content], { type: 'image/svg+xml' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${svg.name}.svg`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="px-3 py-2 bg-green-100 text-green-600 rounded-xl text-sm font-medium hover:bg-green-200 transition-all duration-300"
                            title="Download SVG"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCopySvg(svg.content)}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-200 transition-all duration-300"
                            title="Copy SVG"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(svg.id)}
                            disabled={deleteLoading === svg.id}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 disabled:opacity-50 transition-all duration-300"
                            title="Delete SVG"
                          >
                            {deleteLoading === svg.id ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                </div>
              </div>
            ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for SVG Details */}
        {selectedSvg && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSvg.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedSvg.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSvg(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Large SVG Preview */}
                <div className="mb-6 p-8 bg-gray-50 rounded-lg flex justify-center items-center min-h-[400px] overflow-hidden">
                  <div 
                    className="w-full h-96 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedSvg.content.replace(
                        /<svg([^>]*)>/,
                        '<svg$1 style="max-width: 100%; max-height: 100%; width: auto; height: auto;">'
                      )
                    }}
                  />
                </div>

                {/* SVG Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Uploaded:</span>
                    <span className="ml-2 text-gray-600">{formatDate(selectedSvg.uploadDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">File Size:</span>
                    <span className="ml-2 text-gray-600">{formatFileSize(selectedSvg.fileSize)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleCopySvg(selectedSvg.content)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copySuccess ? (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy SVG
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([selectedSvg.content], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedSvg.name}.svg`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download SVG
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedSvg(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgViewer;
