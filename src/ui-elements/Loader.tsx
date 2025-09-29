export function AirLoader() {
  return (
    <div className="relative w-12 h-12" aria-label="Loading air quality">
      <div className="absolute inset-0 rounded-full border-2 border-[#123524]/30 animate-[spin_2s_linear_infinite]" />
      <div className="absolute inset-2 rounded-full border-2 border-[#123524]/20 animate-[spin_3s_linear_infinite_reverse]" />
      <span className="absolute left-1 top-1 w-2 h-2 bg-[#123524]/70 rounded-full animate-ping" />
      <span className="absolute right-2 top-3 w-1.5 h-1.5 bg-[#123524]/60 rounded-full animate-ping [animation-delay:200ms]" />
      <span className="absolute left-4 bottom-2 w-1.5 h-1.5 bg-[#123524]/60 rounded-full animate-ping [animation-delay:400ms]" />
    </div>
  );
}
