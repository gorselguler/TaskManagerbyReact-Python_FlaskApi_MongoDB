function LeftSidebar( ) {
  const menuItems = [
    "Dashboard",
    "Notes",
    "Calculator",
    "Gallery",
    "Documents"
  ];
  return (
    <aside className="w-72 bg-dashboard-bg border-r border-white/5 flex flex-col h-full overflow-hidden">
      <div className="p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-8 text-slate-500 font-black px-4">
          Core System
        </p>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <div
              key={item}
              className={`
                group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
                ${item === 'Dashboard' 
                  ? 'bg-gradient-to-r from-dusk-start/10 to-dusk-end/5 border border-dusk-start/20' 
                  : 'hover:bg-slate-900/50 border border-transparent hover:border-white/5'}
              `}
            >
              <span className={`
                text-sm font-semibold tracking-wide
                ${item === 'Dashboard' ? 'text-dusk-end' : 'text-slate-400 group-hover:text-slate-200'}
              `}>
                {item}
              </span>
              
              {item === 'Dashboard' && (
                <div className="w-1.5 h-1.5 rounded-full bg-dusk-end shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
              )}
              
              {item !== 'Dashboard' && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-4 bg-gradient-to-b from-warm-start to-warm-end rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
      </div>
    </aside>
  );
}

export default LeftSidebar;