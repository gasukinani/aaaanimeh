import { useAppStore } from '../store';
import { AnimeCard } from '../components/AnimeCard';
import { Link } from 'react-router-dom';
import { Play, History, Heart } from 'lucide-react';

export function Favorites() {
  const { favorites, history } = useAppStore();

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Continue Watching</h1>
          </div>
          <Link to="/search" className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:underline">Browse More</Link>
        </div>
        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {history.slice(0, 8).map((item) => (
              <Link
                key={`${item.animeId}-${item.lastEpisode}`}
                to={`/watch/${item.animeId}/${item.lastEpisode}`}
                className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/5 p-3 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all flex flex-col gap-3 shadow-xl backdrop-blur-md"
              >
                <div className="relative aspect-[16/10] bg-zinc-800 rounded-lg overflow-hidden shrink-0 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src={item.image || 'https://via.placeholder.com/640x360?text=No+Image'} 
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 z-20">
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[85%] shadow-lg shadow-indigo-500/50"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 scale-95 group-hover:scale-100">
                     <div className="bg-indigo-500 shadow-xl shadow-indigo-500/50 backdrop-blur-md rounded-full p-3 transform transition-transform group-hover:rotate-12">
                       <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                     </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-start px-1">
                  <h3 className="text-sm font-black truncate uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-white/40 font-black italic uppercase">Episode {item.lastEpisode}</p>
                    <span className="text-[10px] text-indigo-400 font-black uppercase italic tracking-tighter">Continue</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
             <History className="w-12 h-12 text-white/10 mx-auto mb-4" />
             <p className="text-white/30 font-bold uppercase tracking-widest text-sm">Your watch history is empty</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-8 px-2">
          <Heart className="w-6 h-6 text-pink-500 fill-current" />
          <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">My Favorites</h2>
        </div>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {favorites.map((anime) => (
              <AnimeCard key={anime.id || anime.mal_id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
            <Heart className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-bold uppercase tracking-widest text-sm">You haven't added any favorites yet</p>
            <Link 
              to="/search" 
              className="mt-6 inline-flex bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all text-xs uppercase tracking-widest"
            >
              Discover Anime
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
