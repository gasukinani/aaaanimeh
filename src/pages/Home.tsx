import { useEffect, useState } from 'react';
import { getTopAnime, getRecentEpisodes, getGenres, getTopMovies, getTopRatedAnime, getAnimeDetails } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { Flame, Clock, Play, History, ChevronRight, LayoutGrid, Sparkles, Star, Film, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';

export function Home() {
  const [topAnime, setTopAnime] = useState<any[]>([]);
  const [recentAnime, setRecentAnime] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [heroAnime, setHeroAnime] = useState<any>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { history } = useAppStore();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [top, recent, genreData, movies, rated] = await Promise.all([
          getTopAnime(),
          getRecentEpisodes(),
          getGenres(),
          getTopMovies(),
          getTopRatedAnime()
        ]);
        
        setTopAnime(top.slice(0, 13));
        setRecentAnime(recent.slice(0, 12));
        setGenres(genreData.slice(0, 12));
        setTopMovies(movies.slice(0, 6));
        setTopRated(rated.slice(0, 6));

        // Fetch rich details for the first top anime for hero section
        if (top[0]) {
          try {
            const details = await getAnimeDetails(top[0].id);
            setHeroAnime(details);
          } catch (e) {
            setHeroAnime(top[0]);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch home data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const hero = heroAnime || topAnime[0];

  return (
    <div className="space-y-8 md:space-y-12 pb-24 md:pb-8 italic">
      {/* Hero Section */}
      {hero && (
        <section className="relative h-[350px] sm:h-[480px] md:h-[550px] w-full rounded-2xl md:rounded-[32px] overflow-hidden border border-white/10 mb-8 shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
          <div className="absolute inset-0">
             <img 
               src={hero.img || 'https://via.placeholder.com/1920x1080?text=No+Image'} 
               alt="Hero"
               className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
             />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-12 z-20 flex flex-col justify-end h-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="bg-indigo-500 text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded not-italic">HD 1080P</span>
                <span className="bg-white/20 text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm not-italic">Trending #1</span>
                {hero.genres?.[0] && <span className="bg-white/20 text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm hidden xs:inline not-italic">{typeof hero.genres[0] === 'string' ? hero.genres[0] : hero.genres[0].name}</span>}
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 md:mb-3 tracking-tight line-clamp-2 drop-shadow-lg italic leading-tight">
                {hero.title}
              </h1>
              {hero.synopsis && (
                <p className="text-white/70 text-[10px] sm:text-xs md:text-base line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 font-bold max-w-xl not-italic">
                  {hero.synopsis}
                </p>
              )}
              <div className="flex items-center gap-2 md:gap-4 not-italic">
                <Link 
                  to={`/anime/${hero.id}`}
                  className="flex items-center gap-4 bg-indigo-500 text-white px-5 md:px-8 py-2 md:py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg text-sm md:text-base"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  Watch Now
                </Link>
                <Link 
                  to={`/anime/${hero.id}`}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 md:px-8 py-2 md:py-3 rounded-xl font-bold hover:bg-white/20 transition-all text-sm md:text-base"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Quick Selector */}
      <section className="not-italic px-1">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-black italic tracking-tighter uppercase">Categories</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {genres.map((genre) => (
            <Link
              key={genre.mal_id}
              to={`/search?genre=${genre.mal_id}&name=${encodeURIComponent(genre.name)}`}
              className="shrink-0 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-500 hover:bg-indigo-500/10 transition-all"
            >
              {genre.name}
            </Link>
          ))}
          <Link 
             to="/search" 
             className="shrink-0 bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
          >
            All Genres
          </Link>
        </div>
      </section>

      {/* Continue Watching Section */}
      {history.length > 0 && (
        <section className="not-italic">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <History className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
            <h2 className="text-lg md:text-2xl font-black italic tracking-tighter uppercase">Continue Watching</h2>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-6 px-1 custom-scrollbar">
            {history.slice(0, 10).map((item) => (
              <Link 
                key={item.animeId}
                to={`/watch/${item.animeId}/${item.lastEpisode}`}
                className="shrink-0 w-56 md:w-72 bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
              >
                <div className="relative aspect-video bg-zinc-800">
                  <img 
                    src={item.image || 'https://via.placeholder.com/640x360?text=No+Image'} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/40">
                      <Play className="w-6 h-6 fill-current text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-indigo-500 w-[70%]" /> {/* Fake progress bar for UI */}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-white/50 font-black italic uppercase">Episode {item.lastEpisode}</p>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sections */}
      <section className="not-italic">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Top Trending</h2>
          </div>
          <Link to="/search?type=trending" className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline px-3 py-1 bg-white/5 rounded-full border border-white/5">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {topAnime.slice(1).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Top Movies Section */}
      <section className="not-italic">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Top Movies</h2>
          </div>
          <Link to="/search?type=movie" className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline px-3 py-1 bg-white/5 rounded-full border border-white/5">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {topMovies.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="not-italic">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Top Rated</h2>
          </div>
          <Link to="/search?type=toprated" className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline px-3 py-1 bg-white/5 rounded-full border border-white/5">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {topRated.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      <section className="not-italic">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Seasonal Now</h2>
          </div>
          <Link to="/search?type=seasonal" className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline px-3 py-1 bg-white/5 rounded-full border border-white/5">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {recentAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
}
