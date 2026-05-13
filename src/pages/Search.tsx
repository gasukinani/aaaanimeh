import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAnime } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { Search as SearchIcon, Ghost, LayoutGrid, List, Play } from 'lucide-react';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const genreId = searchParams.get('genre') || '';
  const genreName = searchParams.get('name') || '';
  const type = searchParams.get('type') || '';
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchResults = async () => {
      // If nothing is selected, don't just clear, maybe show general browse if user wants
      if (!query && !genreId && !type) {
        setIsLoading(true);
        const data = await searchAnime('', 1);
        setResults(data);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchAnime(query, 1, genreId, type);
        setResults(data);
      } catch (error) {
        console.warn("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [query, genreId, type]);

  const setType = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    if (!newType) params.delete('type');
    else params.set('type', newType);
    setSearchParams(params);
  };

  return (
    <div className="pb-24 md:pb-8">
      {/* Mobile search input */}
      <div className="md:hidden relative mb-8">
         <div className="relative flex items-center group w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md transition-all focus-within:border-indigo-500/50 focus-within:bg-indigo-500/5 shadow-xl">
           <SearchIcon className="w-5 h-5 text-white/40 group-focus-within:text-white mr-3 shrink-0" />
           <input
              type="text"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setSearchParams({ q: e.target.value, genre: genreId, name: genreName, type: type })}
              className="bg-transparent outline-none w-full placeholder:text-white/20 text-white font-bold"
            />
         </div>
      </div>

      <div className="mb-6 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex-1">
          {genreId ? (
            <span className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
              Category: <span className="text-indigo-400">"{genreName}"</span>
            </span>
          ) : query ? (
            <span className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
              Search: <span className="text-indigo-400">"{query}"</span>
            </span>
          ) : type ? (
            <span className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
              Browse: <span className="text-indigo-400 capitalize">"{type}"</span>
            </span>
          ) : 'Browse All'}
        </h1>

        <div className="flex items-center bg-white/5 p-1 rounded-xl self-start md:self-auto border border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-white/40 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-white/40 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-6 px-2 custom-scrollbar">
        {[
          { label: 'All', value: '' },
          { label: 'Trending', value: 'trending' },
          { label: 'Movies', value: 'movie' },
          { label: 'Seasonal', value: 'seasonal' },
          { label: 'Top Rated', value: 'toprated' },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setType(btn.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              type === btn.value 
                ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/10' 
                : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((anime) => (
              <Link 
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-2xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
              >
                <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-lg border border-white/5">
                  <img 
                    src={anime.img} 
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm md:text-lg italic uppercase tracking-tighter truncate group-hover:text-indigo-400 transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {Array.isArray(anime.genres) && anime.genres?.slice(0, 3).map((g: any) => {
                      const gName = typeof g === 'string' ? g : g.name;
                      return (
                        <span key={gName} className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{gName}</span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-black text-indigo-400 italic">★ {anime.score || 'N/A'}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase">{anime.released || 'N/A'}</span>
                    <span className="text-[10px] font-black italic text-emerald-400 uppercase tracking-tighter">{anime.type}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-all mr-2">
                   <Play className="w-4 h-4 text-white/20 group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        )
      ) : query ? (
        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
           <Ghost className="w-16 h-16 mx-auto mb-4 text-white/10" />
           <p className="text-xl font-black italic uppercase tracking-tighter text-white/40">Zero Signals Found</p>
           <p className="mt-2 text-white/20 font-bold uppercase text-[10px] tracking-widest">Try different coordinates</p>
        </div>
      ) : (
        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
          <SearchIcon className="w-16 h-16 mx-auto mb-6 text-indigo-500/20" />
          <p className="text-lg font-black italic uppercase tracking-tighter text-white/30">Enter Transmission Query</p>
          <p className="mt-2 text-white/20 font-bold uppercase text-[10px] tracking-widest">Search for titles, studios, or genres</p>
        </div>
      )}
    </div>
  );
}
