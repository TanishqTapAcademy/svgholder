import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 animate-pulse"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Hero Content with Parallax */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div 
          className="text-center transform transition-all duration-1000"
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: Math.max(0, 1 - scrollY / 500)
          }}
        >
          {/* Main Heading */}
          <div className="mb-8">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm font-medium">
                ✨ Next-Generation SVG Management
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="inline-block animate-pulse">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  SVG
                </span>
              </span>
              <br />
              <span className="inline-block" style={{ animationDelay: '0.2s' }}>
                <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Holder
                </span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 font-light max-w-4xl mx-auto leading-relaxed mb-4">
              Experience the future of SVG file management with our 
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent font-semibold"> premium platform</span>
            </p>
            
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Seamlessly view, import, and organize your vector graphics with cutting-edge technology
            </p>
          </div>

                  {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: '🎨', text: 'Beautiful Viewer' },
            { icon: '⚡', text: 'Lightning Fast' },
            { icon: '🔧', text: 'Easy Import' },
            { icon: '📱', text: 'Responsive Design' }
          ].map((feature) => (
              <div 
                key={feature.text}
                className="group px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 font-medium transform hover:scale-105 transition-all duration-300 hover:bg-white/20 cursor-pointer"
                style={{ 
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <span className="mr-2 text-lg group-hover:scale-125 inline-block transition-transform duration-300">
                  {feature.icon}
                </span>
                {feature.text}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              to="/svg-viewer"
              className="group relative px-10 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full text-white font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>Start Viewing SVGs</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/svg-importer"
              className="group px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full text-white font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center space-x-3">
                <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Import Your Files</span>
              </span>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10K+', label: 'SVGs Processed' },
              { number: '99.9%', label: 'Uptime' },
              { number: '< 1s', label: 'Load Time' },
              { number: '500+', label: 'Happy Users' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center group cursor-default"
                style={{ 
                  animationDelay: `${index * 100 + 600}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-white/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-white/40 text-xs mt-2 font-medium">Scroll down</p>
        </div>
      </div>

      {/* Parallax SVG Elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-20 left-10 text-white/5 transform rotate-12 animate-pulse">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,10 90,90 10,90" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 text-white/5 transform -rotate-12 animate-pulse" style={{ animationDelay: '1s' }}>
          <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-20 text-white/5 transform rotate-45 animate-pulse" style={{ animationDelay: '2s' }}>
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <rect x="20" y="20" width="60" height="60" />
          </svg>
        </div>
        <div className="absolute top-60 right-10 text-white/5 transform -rotate-6 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <svg width="50" height="50" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 L90 40 L90 90 L10 90 L10 40 Z" />
          </svg>
        </div>
      </div>

      {/* Demo Content Below Hero */}
      <div className="relative z-10 bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"> SVG Holder</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern web technologies for the ultimate SVG management experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🎯',
                title: 'Precision Viewing',
                description: 'Crystal-clear SVG rendering with zoom, pan, and detailed inspection tools'
              },
              {
                icon: '⚡',
                title: 'Lightning Performance',
                description: 'Optimized for speed with instant loading and smooth interactions'
              },
              {
                icon: '🎨',
                title: 'Beautiful Interface',
                description: 'Modern, intuitive design that makes working with SVGs a pleasure'
              }
            ].map((feature) => (
              <div 
                key={feature.title}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
