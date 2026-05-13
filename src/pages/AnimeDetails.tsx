import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeDetails, getAnimeEpisodes, getAnimeRelations, getAnimeRecommendations } from '../lib/api';
import { useAppStore } from '../store';
import { Play, Heart, Star, Calendar, Clock, BookOpen, Share2, Layers, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isFavorite, addFavorite, removeFavorite, history } = useAppStore();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const detailsData = await getAnimeDetails(id);
        const [relationsData, recommendationsData] = await Promise.all([
          getAnimeRelations(id),
          getAnimeRecommendations(id)
        ]);
        setAnime(detailsData);
        setEpisodes(detailsData.episodes || []);
        setRelations(relationsData || []);
        setRecommendations(recommendationsData || []);
      } catch (error) {
        console.warn("Failed to fetch details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
       <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!anime) return <div className="p-8 text-center uppercase font-black italic text-white/40 tracking-tighter">Transmission signal lost: Anime not found.</div>;

  const isFav = isFavorite(anime.id);
  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(anime.id);
    } else {
      // Mapping for library to keep consistency if needed
      addFavorite({
        mal_id: anime.id,
        id: anime.id,
        title: anime.title,
        images: { webp: { large_image_url: anime.img } },
        img: anime.img
      });
    }
  };

  const watchHistory = history.find(h => h.animeId === String(anime.id));
  const continueEpisode = watchHistory?.lastEpisode || 1;

  // We ensure there's at least dummy episodes if none returned
  const displayEpisodes = episodes?.length > 0 
    ? episodes 
    : [];

  return (
    <div className="pb-24">
      <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl md:rounded-[32px] overflow-hidden border border-white/10 mb-8 shadow-2xl">
        <img 
          src={anime.img} 
          alt={anime.title}
          className="w-full h-full object-cover opacity-40 blur-md scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 pb-8 flex flex-col md:flex-row gap-8 items-start md:items-end z-10 h-full justify-end">
          <img 
            src={anime.img} 
            alt={anime.title}
            className="w-32 md:w-56 rounded-2xl shadow-2xl border border-white/10 hidden sm:block z-20 aspect-[16/22] object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-indigo-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded">HD 1080P</span>
              {anime.genres?.map((g: any) => {
                const gName = typeof g === 'string' ? g : g.name;
                return (
                  <span key={gName} className="bg-white/20 text-[10px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm">
                    {gName}
                  </span>
                );
              })}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-2 line-clamp-2 md:line-clamp-none tracking-tight italic uppercase">
              {anime.title}
            </h1>
            <p className="text-white/50 text-sm md:text-base font-medium mb-6 line-clamp-1 italic uppercase tracking-tighter">
              {anime.otherNames}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-medium mb-8">
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-white text-base font-black">N/A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-5 h-5" />
                <span className="font-bold">{anime.released}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold">{anime.episodes?.length || 'N/A'} Episodes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-5 h-5" />
                <span className="font-bold">{anime.type}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link 
                to={`/watch/${anime.id}/${continueEpisode}`}
                className="flex items-center gap-4 bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg shrink-0 text-sm md:text-base"
              >
                <Play className="w-5 h-5 fill-current" />
                {watchHistory ? `Continue EP ${continueEpisode}` : 'Watch Now'}
              </Link>
              
              <button 
                onClick={toggleFavorite}
                className={cn(
                  "p-3 rounded-xl transition-all border shrink-0",
                  isFav 
                    ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md"
                )}
              >
                <Heart className={cn("w-5 h-5", isFav && "fill-current scale-110")} />
              </button>
              
              <button className="p-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-md shrink-0">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5">
            <h2 className="text-xl font-black mb-4 italic uppercase tracking-tighter">Synopsis</h2>
            <div className="text-white/70 leading-relaxed space-y-4 font-medium text-sm md:text-base">
              {anime.synopsis?.split('\\n\\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Episodes</h2>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{displayEpisodes.length} Episodes</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {displayEpisodes.map((ep: any, index: number) => {
                const epIndex = ep.number || index + 1;
                return (
                  <Link
                    key={index}
                    to={`/watch/${anime.id}/${epIndex}`}
                    className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-indigo-500/50 p-4 rounded-2xl transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-white/40 group-hover:text-white group-hover:bg-indigo-500 transition-all font-black">
                        {epIndex}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1">Episode {epIndex}</h4>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-white/30 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recommendations */}
          {recommendations.length > 0 && (
             <section>
              <h2 className="text-xl font-black mb-6 italic flex items-center gap-2 uppercase tracking-tighter px-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Recommendations
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {recommendations.slice(0, 10).map((rec: any) => (
                  <Link
                    key={rec.id}
                    to={`/anime/${rec.id}`}
                    className="shrink-0 w-32 md:w-40 group"
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-2 border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                      <img 
                        src={rec.img} 
                        alt={rec.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white/80 line-clamp-1 group-hover:text-indigo-400 transition-colors">{rec.title}</h4>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-6 shadow-2xl backdrop-blur-md sticky top-24">
            <h3 className="font-black text-lg border-b border-white/5 pb-4 uppercase italic tracking-tighter">Series Info</h3>
            
            <div className="space-y-4 text-sm font-bold">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px] tracking-widest">Type</span>
                <span className="text-white italic">{anime.type}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px] tracking-widest">Status</span>
                <span className="text-white italic">{anime.status}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px] tracking-widest">Released</span>
                <span className="text-white italic">{anime.released}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
