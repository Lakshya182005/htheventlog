import React, { memo, useCallback } from 'react';

interface GenButtonProps {
    name: string;
    entries: { id: string; name: string }[];
    setEntries: (entries: { id: string; name: string }[]) => void;
    setName: (name: string) => void;
    setLimitReached: (reached: boolean) => void;
    setMessage: (message: string) => void;
    setLoading: (loading: boolean) => void;
    setGeneratedId: (id: string | null) => void;
    cachedTeams: Set<string>;
    setCachedTeams: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const GenButton: React.FC<GenButtonProps> = memo(({
    name,
    entries,
    setEntries,
    setName,
    setLimitReached,
    setMessage,
    setLoading,
    setGeneratedId,
    cachedTeams,
    setCachedTeams,
}) => {
    const generateId = useCallback(() => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `UID-${timestamp}-${random}`.toUpperCase();
    }, []);

    const handleClick = useCallback(async () => {
        setMessage('');
        setGeneratedId(null);
        const trimmedName = name.trim();
        if (!trimmedName) {
            setMessage('ENTER TEAM NAME');
            return;
        }
        if (entries.length >= 10) {
            setLimitReached(true);
            setMessage('YOU ARE LATE!');
            return;
        }
        setLoading(true);

        const flicker = () => {
            document.body.style.backgroundColor = '#ffffff';
            setTimeout(() => document.body.style.backgroundColor = '#000000', 50);
            setTimeout(() => document.body.style.backgroundColor = '#ffffff', 100);
            setTimeout(() => document.body.style.backgroundColor = '#000000', 150);
        };
        flicker();

        try {
            // Check cached teams first to avoid network call on every keystroke
            if (cachedTeams.size === 0) {
                // Fetch existing entries to cache team names
                const res = await fetch('http://localhost:3000/api/entries');
                if (!res.ok) {
                    throw new Error('Failed to fetch entries');
                }
                const existingEntries = await res.json();
                const teamNames = new Set(existingEntries.map((entry: { name: string }) => entry.name.toLowerCase())) as Set<string>;
                setCachedTeams(teamNames);
            }

            const teamExists = cachedTeams.has(trimmedName.toLowerCase());

            if (!teamExists) {
                setMessage('TEAM NOT FOUND');
                return;
            }

            const newEntry = {
                id: generateId(),
                name: trimmedName,
            };
            const res = await fetch('http://localhost:3000/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntry),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save data on the server');
            }
            const data = await res.json();
            setEntries([...entries, data]);
            setGeneratedId(data.id);
            setName('');

            // Update cache with new team if not already present
            setCachedTeams((prev: Set<string>) => new Set([...prev, trimmedName.toLowerCase()]));
        } catch (error) {
            console.error('Error:', error);
            setMessage((error as Error).message || 'CONNECTION ERROR');
        } finally {
            setLoading(false);
        }
    }, [name, entries.length, setMessage, setGeneratedId, setLoading, setLimitReached, setEntries, setName, generateId, cachedTeams, setCachedTeams]);

    const isDisabled = entries.length >= 10;

    return (
        <button
            onClick={handleClick}
            disabled={isDisabled}
            className={`w-full rounded-lg px-4 py-2 text-sm sm:text-base text-white font-medium transition-all duration-200 font-mono ${
                isDisabled
                    ? "bg-gray-600 cursor-not-allowed border border-gray-500"
                    : "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 border border-cyan-400 shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/75"
            }`}
        >
            GENERATE ID
        </button>
    );
});

export default GenButton;
