export function CinematicSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      <div className="relative hidden min-h-[420px] lg:block">
        <img src="/hero-portal.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070b16]" />
      </div>
      <div className="flex items-center px-6 py-16 sm:px-12">{children}</div>
    </div>
  );
}
