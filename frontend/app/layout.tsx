import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackTheHunt - Cyber Challenge",
  description: "Scan QR codes to complete levels in this cyber challenge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Predefined deterministic pattern (no Math.random)
  const columns = Array.from({ length: 20 }).map((_, i) => {
    return {
      left: `${(i * 5) % 100}%`, // evenly spaced (still looks random with animation)
      delay: `${(i % 5) * 0.5}s`,
      duration: `${2 + (i % 3)}s`,
      characters: Array.from({ length: 30 }).map(
        (_, j) => String.fromCharCode(65 + ((i + j) % 26))
      ),
    };
  });

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,0,0.1)_0%,_transparent_50%)] opacity-20"></div>
        <div className="fixed inset-0 bg-[linear-gradient(90deg,_transparent_0%,_rgba(0,255,0,0.03)_50%,_transparent_100%)] animate-pulse"></div>

        {/* Matrix-like rain (deterministic, safe) */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

          {columns.map((col, i) => (
            <div
              key={i}
              className="absolute text-green-500/20 text-xs animate-bounce"
              style={{
                left: col.left,
                animationDelay: col.delay,
                animationDuration: col.duration,
              }}
            >
              {col.characters.map((char, j) => (
                <div key={j} className="leading-none">
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Page Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </body>
    </html>
  );
}
