function LeftSidebar( ) {
const menuItems = [
  "Dashboard",
  "Notes",
  "Calculator",
  "Gallery",
  "Documents"
];
return (
  <div className = "w-56 min-h-screen bg-indigo-100 flex flex-col p-4 shadow-lg">

    <p className = "text-xs uppercase tracking-[0.2em] mb-6 text-indigo-400 font-bold px-3">
      System
    </p>

     {/* Menu List */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <a
            key={item}
            href="#"
            className="py-2.5 px-3 rounded-xl hover:bg-indigo-700/50 hover:text-white transition-all duration-200 text-sm font-medium flex items-center group"
          >
            {/* Dot indicator (simulating an icon space for now) */}
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3 group-hover:bg-indigo-300 transition-colors"></span>
            {item}
          </a>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-indigo-800">
        <a href="#" className="py-2.5 px-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-3"></span>
          Logout
        </a>
      </div>
    </div>
  );
}

export default LeftSidebar;