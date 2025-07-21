import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';

const AuthLayout = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This triggers the animation shortly after the component mounts
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const resetMousePos = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* The main card container. It will fade in and scale up slightly on load. */}
      <div className={`w-full max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 ease-out ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* We use a grid for a robust responsive layout. The 'relative' class is crucial for z-index to work. */}
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Side: Visuals and Branding */}
          {/* This panel starts shifted to the right (centered) and moves left into place. It has a higher z-index to appear on top. */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetMousePos}
            className={`hidden md:block relative bg-blue-600 p-12 text-white overflow-hidden z-20 transition-transform duration-1000 ease-in-out transform ${isMounted ? 'translate-x-0' : 'md:translate-x-1/2'}`}
          >
            {/* Animated background shapes */}
            <div 
              className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500 rounded-full opacity-50 transition-transform duration-500 ease-out"
              style={{ transform: `translate(${mousePos.x / 20}px, ${mousePos.y / 20}px)` }}
            ></div>
            <div 
              className="absolute -bottom-20 -right-10 w-40 h-40 bg-blue-700 rounded-full opacity-60 transition-transform duration-500 ease-out"
              style={{ transform: `translate(${mousePos.x / 15}px, ${mousePos.y / 15}px)` }}
            ></div>
            <div 
              className="absolute top-24 right-16 w-24 h-24 bg-blue-400 rounded-full opacity-40 transition-transform duration-500 ease-out"
              style={{ transform: `translate(${mousePos.x / 25}px, ${mousePos.y / 25}px)` }}
            ></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-2">
                <Logo size={32} />
                <span className="text-2xl font-bold">ShiftSwap</span>
              </div>
              <div className="mt-auto">
                <h2 className="text-3xl font-bold">A new era of shift management.</h2>
                <p className="mt-4 text-blue-100">
                  Trade shifts, request leave, and stay organized effortlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Form Content */}
          {/* This white panel also starts shifted (to the left, under the blue panel) and moves right into its place. */}
          <div 
            className={`relative bg-white p-8 z-10 transition-transform duration-1000 ease-in-out transform ${isMounted ? 'translate-x-0' : 'md:-translate-x-1/2'}`}
          >
            <div className="flex items-center justify-center h-full">
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;