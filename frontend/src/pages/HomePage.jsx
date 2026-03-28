import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "../assets/Hero.jpg";

const HomePage = () => {
  // Helper function to animate text letter-by-letter
  const AnimatedText = ({ text, delayOffset = 0, className = "" }) => {
    return (
      <span className={className}>
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block opacity-0"
            style={{
              animation: `fadeUpLetter 0.6s ease-out forwards`,
              animationDelay: `${delayOffset + index * 0.04}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <style>
        {`
          @keyframes fadeUpLetter {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fade-in-delayed {
            opacity: 0;
            animation: fadeIn 1s ease-out 1.5s forwards;
          }
        `}
      </style>

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen w-full flex items-center justify-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HeroImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto mt-[-5vh]">
          <span className="text-blue-200 font-semibold tracking-wider uppercase text-sm mb-4 border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 rounded-full backdrop-blur-sm opacity-0" style={{ animation: 'fadeIn 1s ease-out 0.2s forwards' }}>
            WellSync Platform
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            <AnimatedText text="Smart Rural Water" delayOffset={0.3} />
            <br className="hidden md:block" />
            <AnimatedText text="Well Monitoring" delayOffset={0.9} className="text-blue-400" />
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-100 mb-10 max-w-2xl font-light leading-relaxed animate-fade-in-delayed">
            Empowering communities with real-time tracking, lab reports, and automated maintenance alerts for safe drinking water.
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-0" style={{ animation: 'fadeIn 1s ease-out 2s forwards' }}>
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-gray-50 py-24 px-6 md:px-20 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Comprehensive Toolkit</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need in one place</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              A powerful, unified system designed specifically for the unique challenges of rural water management.
            </p>
          </div>
          
          {/* Expanded to a 6-card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Get a clear, real-time overview of well conditions, including water levels, usage stats, and operational status.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lab Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly upload, store, and access lab testing results to ensure water continuously meets safety and purity standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Maintenance</h3>
              <p className="text-gray-600 leading-relaxed">
                Track repair requests and schedule maintenance before breakdowns occur to keep communities continuously supplied.
              </p>
            </div>

            {/* Feature 4: Interactive Mapping */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Mapping</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize well locations and their current status on interactive maps to easily coordinate field teams across vast regions.
              </p>
            </div>

            {/* Feature 5: Role-Based Access */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Dashboards</h3>
              <p className="text-gray-600 leading-relaxed">
                Tailored interfaces for community members, admins, field officers, and lab testers, ensuring everyone gets exactly the tools they need.
              </p>
            </div>

            {/* Feature 6: Mobile Ready */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile & Offline Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Designed for the field. Log data and report critical issues even in remote areas with low connectivity, syncing automatically later.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= EXPANDED ABOUT US / IMPACT SECTION ================= */}
      <section className="bg-blue-600 py-24 px-6 md:px-20 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content Block */}
          <div>
            <span className="text-blue-200 font-semibold tracking-wider uppercase text-sm mb-3 block">Our Mission</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Dedicated to providing safe water for everyone.</h2>
            
            <p className="text-blue-50 text-lg leading-relaxed mb-6">
              Access to clean, reliable drinking water is a fundamental human right. However, rural communities often face challenges with delayed maintenance, unverified water quality, and disconnected communication with water authorities. 
            </p>
            
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              WellSync was built to bridge this critical gap. Our platform centralizes data, empowering communities to report issues instantly, while giving field officers and lab technicians the tools they need to ensure every drop is safe and every well is functioning sustainably.
            </p>

            {/* Core Values List */}
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-lg text-blue-50">Community-Driven Reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-lg text-blue-50">Transparent Water Quality Testing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-lg text-blue-50">Proactive Infrastructure Maintenance</span>
              </li>
            </ul>
          </div>
          
          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center transform transition duration-500 hover:scale-105 hover:bg-white/20">
              <span className="block text-5xl font-extrabold mb-3 text-white drop-shadow-sm">500+</span>
              <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Wells Monitored</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center transform transition duration-500 hover:scale-105 hover:bg-white/20">
              <span className="block text-5xl font-extrabold mb-3 text-white drop-shadow-sm">12k</span>
              <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Lives Impacted</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center transform transition duration-500 hover:scale-105 hover:bg-white/20">
              <span className="block text-5xl font-extrabold mb-3 text-white drop-shadow-sm">48h</span>
              <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Avg Repair Time</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center transform transition duration-500 hover:scale-105 hover:bg-white/20">
              <span className="block text-5xl font-extrabold mb-3 text-white drop-shadow-sm">99%</span>
              <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Water Safety</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl tracking-tight">WellSync</span>
          </div>
          <p className="text-center md:text-left text-sm">&copy; 2026 WellSync Systems. All rights reserved.</p>
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default HomePage;