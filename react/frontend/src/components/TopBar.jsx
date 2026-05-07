import { useState } from 'react';
function TopBar() {
const [isLoggedIn, setIsLoggedIn] = useState(false);

const handleLogin = () => {
    setIsLoggedIn(true);
};

const user = {
    name: 'Gorsel',
    surname: 'Guler',
};
  return (
    <header className="h-16 bg-card-bg border-b border-white/5 flex items-center justify-between px-8 relative overflow-hidden">
      {/* Background Gradient Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-dusk-start/10 to-transparent pointer-events-none"></div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dusk-start to-dusk-end flex items-center justify-center shadow-lg shadow-dusk-start/20">
          <span className="text-white font-black text-xs">TM</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-dusk-start to-dusk-end">Manager</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right flex flex-col">
              <span className="text-xs font-bold text-white leading-none">{user.name}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-warm-start to-warm-end p-[2px] shadow-lg shadow-warm-start/10">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                {user.name[0]}{user.surname[0]}
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-dusk-start to-dusk-end text-white text-xs font-bold hover:scale-105 transition shadow-lg shadow-dusk-start/20"
          >
            Login Access
          </button>
        )}
      </div>
    </header>
  );
}

export default TopBar;