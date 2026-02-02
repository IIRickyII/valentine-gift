import React, { useState, useEffect, useRef, memo } from 'react';
import { Heart, Sparkles, Star, ChevronRight, Utensils, Coffee, Camera, Play } from 'lucide-react';

const MEDIA_ASSETS = {
  // Page 1: The GIF on the landing page
  // Make sure you have a file named 'intro.gif' in your public folder
  landingGif: "./intro.gif",
  
  // Page 3: The dancing GIF when she says YES
  // Make sure you have a file named 'dance.gif' in your public folder
  successGif: "./dance.gif",
  
  // Page 4: The special video you made
  // Make sure you have a file named 'movie.mp4' in your public folder
  videoUrl: "./movie.MP4",
  
  // Page 4: Optional thumbnail image for the video player (poster)
  // You can leave this empty or add a jpg to public and link it here like "./thumb.jpg"
  videoThumbnail: ""
};
// -----------------------------------------------------

// Memoized Heart component to prevent animation resets during re-renders
const HeartItem = memo(({ heart }) => (
  <div
    className="absolute bottom-[-10%] animate-float opacity-40"
    style={{
      left: `${heart.left}%`,
      color: heart.color,
      fontSize: `${heart.size}px`,
      animationDuration: `${heart.duration}s`,
      animationDelay: `${heart.delay}s`,
      transform: `rotate(${heart.rotation}deg)`
    }}
  >
    <Heart fill="currentColor" stroke="none" />
  </div>
));

const FloatingHearts = memo(({ hearts }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {hearts.map((heart) => (
      <HeartItem key={heart.id} heart={heart} />
    ))}
  </div>
));

const App = () => {
  const [page, setPage] = useState('landing');
  const [hearts, setHearts] = useState([]);
  const [noOpacity, setNoOpacity] = useState(1);
  const [isYesHovered, setIsYesHovered] = useState(false);
  
  const noButtonRef = useRef(null);

  // Generate the hearts once on mount
  useEffect(() => {
    const heartColors = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fbbf24'];
    const newHearts = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 24 + 12,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * 10,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      rotation: Math.random() * 45
    }));
    setHearts(newHearts);
  }, []);

  // Mouse tracking logic for proximity effects (strictly for the NO button)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (page === 'proposal') {
        // --- NO BUTTON LOGIC (Localized Proximity based) ---
        if (noButtonRef.current) {
          const rect = noButtonRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

          // Increased thresholds to ensure it vanishes by the time the mouse reaches the periphery
          // The button is roughly 192px wide, so its horizontal radius is 96px.
          // Setting Min to 120 ensures it's fully gone before the mouse gets close.
          const thresholdMax = 220; // Starts fading from further out
          const thresholdMin = 120; // Completely invisible before reaching the button edge
          
          if (distance < thresholdMin) {
            setNoOpacity(0);
          } else if (distance > thresholdMax) {
            setNoOpacity(1);
          } else {
            const strength = (distance - thresholdMin) / (thresholdMax - thresholdMin);
            setNoOpacity(strength);
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [page]);

  const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-white/40 backdrop-blur-lg border border-white/60 shadow-2xl rounded-[3rem] p-8 md:p-12 transition-all duration-700 ${className}`}>
      {children}
    </div>
  );

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10 animate-fade-in">
            <GlassCard className="max-w-xl">
              <div className="mb-10 relative inline-block">
                <div className="absolute -inset-6 bg-rose-300 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-[10px] border-white shadow-xl overflow-hidden bg-rose-100 flex items-center justify-center relative z-10">
                  {/* Updated to use config */}
                  <img 
                    src={MEDIA_ASSETS.landingGif} 
                    alt="GIF of me" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndXp4ZzRyeGZ6Z3RyeGZ6Z3RyeGZ6Z3RyeGZ6Z3RyeGZ6ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L4lvB7fU5m6G5X6gqO/giphy.gif"
                        console.log("Error loading local GIF. Make sure 'intro.gif' is in the public folder.");
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-rose-500 text-white p-3 rounded-full shadow-lg">
                  <Heart fill="currentColor" size={24} />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-rose-800 mb-6 font-serif tracking-tight">
                Hey my beautiful lady... ❤️
              </h1>
              <p className="text-lg md:text-xl text-rose-600/80 mb-10 max-w-md italic leading-relaxed font-medium">
                "I have a very important question to ask you, and it's imperative that you say yes!"
              </p>
              
              <button 
                onClick={() => setPage('proposal')}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-10 py-5 rounded-full text-xl font-bold shadow-xl shadow-rose-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto group"
              >
                Click for a Surprise
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </GlassCard>
          </div>
        );

      case 'proposal':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10 animate-fade-in">
            <GlassCard className="max-w-2xl">
              <Sparkles className="text-amber-400 w-12 h-12 mx-auto mb-6 animate-spin-slow" />
              <h1 className="text-5xl md:text-7xl font-bold text-rose-600 mb-16 font-serif leading-tight">
                Puchu Baby!! <br/> 
                <span className="text-rose-800">Will you be my Valentine? 🌹</span>
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12 w-full relative h-40">
                <button 
                  onMouseEnter={() => setIsYesHovered(true)}
                  onMouseLeave={() => setIsYesHovered(false)}
                  onClick={() => setPage('success')}
                  className={`bg-rose-500 hover:bg-rose-600 text-white px-16 py-6 rounded-3xl text-3xl font-bold shadow-2xl hover:shadow-rose-300 transition-all z-20 ${isYesHovered ? 'animate-heartthrob' : ''}`}
                >
                  YES! ❤️
                </button>

                <div 
                  ref={noButtonRef}
                  style={{ 
                    opacity: noOpacity,
                    pointerEvents: noOpacity < 0.2 ? 'none' : 'auto',
                    transition: 'opacity 0.2s ease-out' 
                  }}
                  className="w-48"
                >
                  <button 
                    className="bg-white/80 text-rose-300 px-12 py-6 rounded-3xl text-2xl font-bold border-2 border-rose-100 cursor-default w-full"
                    disabled={noOpacity < 0.5}
                  >
                    No 💔
                  </button>
                </div>
              </div>
              
              <p className="mt-12 text-rose-400 font-medium italic">Hint: There is only one right answer!</p>
            </GlassCard>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10 animate-fade-in">
            <GlassCard className="max-w-2xl bg-white/60">
              <div className="mb-10 relative">
                <div className="absolute -inset-12 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl border-[12px] border-white shadow-2xl overflow-hidden bg-white relative z-10 mx-auto">
                  {/* Updated to use config */}
                  <img 
                    src={MEDIA_ASSETS.successGif} 
                    alt="Me dancing" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm5vMHJndXp4ZzRyeGZ6Z3RyeGZ6Z3RyeGZ6Z3RyeGZ6Z3RyeGZ6ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0lsG0TR2uSq5Og/giphy.gif"
                    }}
                  />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-rose-600 mb-4 font-serif drop-shadow-sm">
                YAYYY! ❤️
              </h1>
              <h2 className="text-2xl md:text-3xl text-rose-800 font-medium mb-10 leading-relaxed">
                I knew you'd say yes! 😘<br/>
                <span className="text-rose-500 font-serif italic text-4xl">I love you so much!</span>
              </h2>
              
              <div className="flex justify-center gap-6 mb-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="animate-bounce" 
                    style={{ animationDelay: `${i * 100}ms`, animationDuration: '1s' }}
                  >
                    <Heart fill="#e11d48" className="text-rose-600 w-10 h-10 drop-shadow-lg" />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setPage('video')}
                className="bg-white/80 hover:bg-white text-rose-600 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-3 mx-auto border border-rose-200 group"
              >
                <Play size={24} fill="currentColor" className="group-hover:text-rose-500" />
                A precious memory close to my heart...
              </button>
            </GlassCard>
          </div>
        );

      case 'video':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10 animate-fade-in">
            <GlassCard className="max-w-4xl w-full bg-white/50">
              <h1 className="text-3xl md:text-5xl font-bold text-rose-600 mb-8 font-serif leading-tight">
                Something beautiful you made for us... 🎥
              </h1>
              
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black aspect-[9/16] max-w-sm mx-auto relative">
                {/* Updated to use config */}
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster={MEDIA_ASSETS.videoThumbnail}
                >
                  <source src={MEDIA_ASSETS.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <p className="mt-8 text-rose-600/80 italic text-lg">
                "Every second of this video reminds me why I'm the luckiest person in the world."
              </p>
              
              <button 
                onClick={() => setPage('success')}
                className="mt-8 text-rose-400 hover:text-rose-600 font-medium text-sm transition-colors flex items-center gap-1 mx-auto"
              >
                <ChevronRight className="rotate-180 w-4 h-4" /> Back to our celebration
              </button>
            </GlassCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 overflow-hidden font-sans selection:bg-rose-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Quicksand:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Quicksand', sans-serif;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-float {
          animation: float linear infinite;
        }

        @keyframes heartthrob {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
          15% { transform: scale(1.15); box-shadow: 0 0 20px 5px rgba(225, 29, 72, 0.4); }
          30% { transform: scale(1.05); }
          45% { transform: scale(1.22); box-shadow: 0 0 30px 10px rgba(225, 29, 72, 0.3); }
          70% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }

        .animate-heartthrob {
          animation: heartthrob 0.6s infinite cubic-bezier(0.21, 0.61, 0.35, 1);
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
      
      <FloatingHearts hearts={hearts} />
      {renderPage()}
      
      {/* Decorative corner elements */}
      <div className="fixed top-0 left-0 p-8 opacity-20 pointer-events-none z-0">
        <Camera size={120} className="text-rose-300 -rotate-12" />
      </div>
      <div className="fixed bottom-0 right-0 p-8 opacity-20 pointer-events-none z-0">
        <Utensils size={120} className="text-rose-300 rotate-12" />
      </div>
    </div>
  );
};

export default App;