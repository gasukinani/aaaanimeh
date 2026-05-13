import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnimeDetails, getAnimeEpisodes, getStreamingLinks, getAnimeRelations } from '../lib/api';
import { useAppStore } from '../store';
import { VideoPlayer } from '../components/VideoPlayer';
import { ArrowLeft, Play, List, AlertCircle, ChevronRight, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export function Watch() {
  const { id, episode } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [streamData, setStreamData] = useState<any>(null);
  const [currentServer, setCurrentServer] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const epNumber = parseInt(episode || '1');
  const { addToHistory } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      setStreamData(null);
      setCurrentServer(0);
      try {
        const detailsData = await getAnimeDetails(id);
        
        setAnime(detailsData);
        setEpisodes(detailsData.episodes || []);
        
        // Add to history
        addToHistory({
          id: detailsData.id,
          mal_id: detailsData.id,
          title: detailsData.title,
          img: detailsData.img
        }, epNumber);

        // Fetch streaming link
        const stream = await getStreamingLinks(id, epNumber, detailsData.title);
        
        if (!stream || !stream.sources || stream.sources.length === 0) {
          setError("No video stream found for this episode.");
        } else {
          setStreamData(stream);
        }

      } catch (err) {
        console.warn("Failed to fetch watch data", err);
        setError("Failed to load video stream. The server might be unavailable.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo(0, 0);
  }, [id, epNumber]);

  if (isLoading) {
    return (
       <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!anime) return <div className="p-8 text-center text-gray-400">Anime not found.</div>;

  const displayEpisodes = episodes?.length > 0 
    ? episodes 
    : [];

  const hasNextEpisode = epNumber < (displayEpisodes.length || 0);

  const handleNextEpisode = () => {
    if (hasNextEpisode) {
      const nextEp = episodes.find(e => e.number === epNumber + 1);
      if (nextEp) {
        navigate(`/watch/${id}/${epNumber + 1}`);
      } else if (episodes[epNumber]) {
        navigate(`/watch/${id}/${epNumber + 1}`);
      }
    }
  };

  const handleDownload = () => {
    if (streamData?.download) {
      window.open(streamData.download, '_blank');
    }
  };

  const activeSource = streamData?.sources?.[currentServer];

  return (
    <div className="pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to={`/anime/${anime.id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Details</span>
        </Link>
        <div className="sm:text-right">
          <h1 className="font-bold text-lg md:text-xl line-clamp-1 italic uppercase">{anime.title}</h1>
          <p className="text-sm text-indigo-400 font-bold">Episode {epNumber}</p>
        </div>
      </div>

      <div className="mb-4 relative z-10 w-full rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl bg-black border border-white/10 group">
        {error ? (
          <div className="aspect-video flex flex-col items-center justify-center bg-white/5 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-xl font-semibold mb-2">Stream Unavailable</p>
            <p className="text-white/50 mb-6 max-w-md">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
            >
              Retry
            </button>
          </div>
        ) : activeSource ? (
          <>
            <div 
              key={`${id}-${epNumber}-${currentServer}`}
              className="w-full h-full"
            >
              <VideoPlayer 
                url={activeSource.url} 
                poster={anime.img} 
                onDownload={streamData?.download ? handleDownload : undefined}
              />
            </div>
            <div className="absolute bottom-16 right-4 sm:right-8 z-30 flex flex-col gap-2 scale-90 sm:scale-100 items-end">
              <button
                onClick={() => {
                  const video = document.querySelector('video');
                  if (video) video.currentTime += 85;
                }}
                className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-all border border-white/10 text-xs uppercase tracking-widest hover:bg-white/20"
              >
                Skip Intro
              </button>
              {hasNextEpisode && (
                <button
                  onClick={handleNextEpisode}
                  className="flex items-center gap-2 bg-indigo-500/80 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-all shadow-lg text-sm hover:bg-indigo-600"
                >
                  Next Episode <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-white/5">
            <div className="text-center p-6">
              <Play className="w-12 h-12 text-indigo-500/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium font-mono">ENCRYPTING STREAM...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {streamData?.sources && streamData.sources.length > 1 && (
          <div className="flex flex-wrap gap-2 flex-1">
            {streamData.sources.map((s: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentServer(idx)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                  currentServer === idx 
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                }`}
              >
                {s.name || `Server ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

        {hasNextEpisode && (
          <button
            onClick={handleNextEpisode}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold transition-all border border-white/10 text-sm shrink-0"
          >
            Next Episode <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          {/* Episode Info */}
          <div className="bg-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl md:text-2xl font-black mb-4 italic uppercase tracking-tighter flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              Description
            </h2>
            <p className="text-white/70 leading-relaxed font-medium text-sm md:text-base">
              {anime.synopsis}
            </p>
          </div>
        </div>

        <div className="order-first lg:order-last">
           <div className="flex items-center gap-2 mb-4 px-2">
             <List className="w-5 h-5 text-indigo-400" />
             <h3 className="font-black text-lg uppercase italic tracking-tighter">Episodes</h3>
           </div>
           
           <div className="bg-white/5 rounded-2xl md:rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[400px] lg:h-[600px] shadow-2xl backdrop-blur-md">
             <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {displayEpisodes.map((ep: any, index: number) => {
                   const epIndex = ep.number || index + 1;
                   const isActive = epIndex === epNumber;
                   
                   return (
                     <Link
                       key={index}
                       to={`/watch/${anime.id}/${epIndex}`}
                       className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                         isActive 
                           ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                           : 'hover:bg-white/5 border border-transparent'
                       }`}
                     >
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-lg ${
                         isActive ? 'bg-indigo-500 text-white shadow-indigo-500/30 font-black' : 'bg-white/10 text-white/40 border border-white/5'
                       }`}>
                         {isActive ? <Play className="w-5 h-5 fill-current ml-0.5" /> : epIndex}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className={`text-sm font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-white/70'}`}>
                           Episode {epIndex}
                         </p>
                       </div>
                     </Link>
                   );
                 })}
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
