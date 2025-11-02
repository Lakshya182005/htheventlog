import React, { memo, useCallback, useState, useRef } from 'react';

interface GenInputProps {
    name: string;
    setName: (name: string) => void;
}

const GenInput: React.FC<GenInputProps> = memo(({ name, setName }) => {
    const [isFocused, setIsFocused] = useState(false);
    const debounceRef = useRef<number | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            setName(value);
        }, 300);
    }, [setName]);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    return (
        <div className="mb-4">
            <label htmlFor="team-name" className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                TEAM NAME
            </label>
            <input
                id="team-name"
                type="text"
                value={name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="ENTER TEAM NAME"
                className={`w-full bg-gray-800 border-2 rounded-lg px-3 py-2 text-sm sm:text-base text-cyan-400 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono transition-all duration-300 ${
                    isFocused ? 'border-cyan-300 shadow-lg shadow-cyan-400/50' : 'border-cyan-400'
                }`}
                maxLength={50}
            />
        </div>
    );
});

export default GenInput;
