import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { 
  Gamepad2, 
  Search, 
  X, 
  Maximize2, 
  Minimize2, 
  Trophy, 
  Flame, 
  Monitor
} from "lucide-react";
import gamesData from "./data/games.json";

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans relative overflow-x-hidden">
      {/* Mesh Gradient Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto glass-panel p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ArcadeVault</h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">Unblocked Hub</p>
            </div>
          </div>

          <div className="flex-1 max-w-md relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search unblocked games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleFullScreen}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <div className="h-8 w-[1px] bg-white/10" />
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium text-xs hidden md:block transition-all shadow-lg shadow-indigo-600/20">
              Request Game
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-indigo-500/50 bg-slate-800 hidden sm:block"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar - Categories */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel p-4 flex flex-col gap-2 sticky top-[100px]">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Categories</p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left glass-nav-item flex items-center gap-3 text-sm ${
                  activeCategory === cat 
                    ? "glass-nav-item-active" 
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeCategory === cat ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" : "bg-slate-600"}`}></span>
                {cat}
              </button>
            ))}
            
            <div className="mt-8 p-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-xl">
              <p className="text-sm font-semibold mb-1 text-white">Daily Updates</p>
              <p className="text-[10px] text-slate-400 leading-tight">Check back for the latest unblocked titles added every 24 hours.</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {/* Game Grid Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame size={18} className="text-indigo-400" />
              {activeCategory === "All" ? "Featured Now" : activeCategory}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
              {filteredGames.length} Titles Found
            </span>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedGame(game)}
                  className="glass-card flex flex-col group cursor-pointer overflow-hidden"
                >
                  <div className="aspect-[16/10] relative">
                    <img 
                      src={game.thumbnail} 
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      <span className="px-2 py-0.5 bg-indigo-500 text-[10px] font-bold rounded uppercase shadow-lg shadow-indigo-500/40">Free Play</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-300 transition-colors">{game.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{game.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-panel py-20 flex flex-col items-center justify-center text-center">
              <Monitor className="text-slate-600 mb-4" size={48} strokeWidth={1} />
              <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">No Games Found</h3>
              <p className="text-slate-400 text-sm max-w-xs">We couldn't find any games matching your current search or filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 p-8 glass-panel mx-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Servers: Online (14ms)</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          <nav className="flex gap-6 text-[10px] uppercase font-mono text-slate-400 tracking-widest font-bold">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">DMCA</span>
          </nav>
        </div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
          &copy; 2026 ArcadeVault Systems
        </p>
      </footer>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full max-w-6xl glass-panel overflow-hidden flex flex-col relative shadow-3xl shadow-black/50"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 flex items-center justify-between bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                    <Gamepad2 className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">{selectedGame.title}</h2>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                        <Trophy size={10} /> 4.9 Rating
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Player Mode: Instant Web
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all group border border-transparent hover:border-white/10"
                >
                  <X className="text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Game Viewport */}
              <div className="flex-1 bg-black relative">
                <iframe 
                  src={selectedGame.iframeUrl}
                  title={selectedGame.title}
                  className="w-full h-full border-none"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Device Support</span>
                    <span className="text-xs font-bold text-slate-300">Desktop / Full HD</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    Share
                  </button>
                  <button className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/30">
                    Play Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
