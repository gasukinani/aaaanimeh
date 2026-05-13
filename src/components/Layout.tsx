import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Home, Heart, PlaySquare, Compass, Tv } from 'lucide-react';

export function Layout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Mesh Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative flex flex-col min-h-screen w-full backdrop-blur-3xl z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-4 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8 max-w-7xl mx-auto w-full">
            <NavLink to="/" className="flex items-center justify-center px-4 h-10 md:h-12 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all shrink-0 group">
              <span className="text-lg md:text-2xl font-black text-white italic tracking-tighter uppercase group-hover:scale-105 transition-transform">AAnime</span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-4 text-xs lg:text-sm font-semibold uppercase tracking-wider">
              <NavLink to="/" className={({isActive}) => `px-4 py-2 rounded-full transition-colors ${isActive ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:bg-white/5"}`}>Home</NavLink>
              <NavLink to="/search" className={({isActive}) => `px-4 py-2 rounded-full transition-colors ${isActive ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:bg-white/5"}`}>Browse</NavLink>
              <NavLink to="/favorites" className={({isActive}) => `px-4 py-2 rounded-full transition-colors ${isActive ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:bg-white/5"}`}>My List</NavLink>
            </nav>

            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm hidden md:flex ml-auto">
              <div className="relative flex items-center group w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-sm transition-colors focus-within:border-indigo-500/50 focus-within:bg-white/10">
                <SearchIcon className="w-5 h-5 text-white/40 group-focus-within:text-white mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full placeholder:text-white/30 text-white"
                />
              </div>
            </form>

            {/* Mobile search toggle */}
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden ml-auto p-2.5 bg-white/5 border border-white/10 rounded-full"
            >
              <SearchIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        {/* Mobile Search Bar Expansion */}
        {isMobileSearchOpen && (
          <div className="md:hidden sticky top-20 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 p-4 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 px-5 py-3 rounded-2xl outline-none text-white font-bold"
              />
            </form>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Mobile nav indicator */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-50 pb-safe">
          <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-lg ${isActive ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </NavLink>
          <NavLink to="/search" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-lg ${isActive ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"}`}>
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Browse</span>
          </NavLink>
          <NavLink to="/favorites" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-lg ${isActive ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"}`}>
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">My List</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
