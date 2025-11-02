import { useState, useCallback, useEffect } from "react";
import GenButton from "../components/genButton/genbutton";
import GenInput from "../components/genInput/geninput";

const Genpage = () => {
    const [name, setName] = useState('');
    const [entries, setEntries] = useState<{ id: string; name: string }[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedId, setGeneratedId] = useState<string | null>(null);
    const [cachedTeams, setCachedTeams] = useState<Set<string>>(new Set());

    const handleSetName = useCallback((newName: string) => setName(newName), []);
    const handleSetEntries = useCallback((newEntries: { id: string; name: string }[]) => setEntries(newEntries), []);
    const handleSetMessage = useCallback((newMessage: string) => setMessage(newMessage), []);
    const handleSetLoading = useCallback((newLoading: boolean) => setLoading(newLoading), []);
    const handleSetGeneratedId = useCallback((newId: string | null) => setGeneratedId(newId), []);

    // Typing animation for title
    const [titleText, setTitleText] = useState('');
    const fullTitle = 'TEAM ID GENERATOR';

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < fullTitle.length) {
                setTitleText(fullTitle.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
            {/* Animated Matrix Background */}
            <div className="absolute inset-0 opacity-10">
            <div className="matrix-bg" style={{ willChange: 'transform' }}></div>
            </div>
            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>
            <div className="bg-gray-900 border-2 border-cyan-400 rounded-lg p-4 sm:p-8 shadow-lg shadow-cyan-400/50 max-w-md w-full relative z-10">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-cyan-400 mb-4 sm:mb-6 font-mono title-text">{titleText}<span className="animate-pulse">|</span></h1>
                <GenInput name={name} setName={handleSetName} />
                <GenButton
                    name={name}
                    entries={entries}
                    setEntries={handleSetEntries}
                    setName={handleSetName}
                    setLimitReached={() => {}}
                    setMessage={handleSetMessage}
                    setLoading={handleSetLoading}
                    setGeneratedId={handleSetGeneratedId}
                    cachedTeams={cachedTeams}
                    setCachedTeams={setCachedTeams}
                />
                {loading && (
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                        <p className="ml-2 text-cyan-400 font-mono">GENERATING...</p>
                    </div>
                )}
                {generatedId && (
                    <div className="mt-4 p-3 sm:p-4 bg-gray-800 border border-green-400 rounded-lg shadow-lg shadow-green-400/50 animate-fade-in relative overflow-hidden holographic-card">
                        {/* Holographic effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <h3 className="text-base sm:text-lg font-semibold text-green-400 font-mono relative z-10 animate-bounce">ACCESS GRANTED</h3>
                        <p className="text-green-300 font-mono relative z-10 text-sm sm:text-base">ID: <span className="text-white font-bold text-lg sm:text-xl animate-pulse">{generatedId}</span></p>
                    </div>
                )}
                {message && <p className="mt-4 text-red-400 font-mono text-center">{message}</p>}
                <div className="mt-4 text-sm text-cyan-300 text-center font-mono">
                    ENTRIES: {entries.length}/10
                </div>
            </div>

        </div>
    );
};

export default Genpage;
