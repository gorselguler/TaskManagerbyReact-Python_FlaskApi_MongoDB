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
    <div className="h-16 bg-indigo-700 text-white flex items-center justify-between px-6 shadow-md">
      {/* LEFT SIDE: App Name */}
      <h1 className="text-xl font-bold tracking-wide">Task Manager</h1>

      {/* RIGHT SIDE: Profile Area */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          /* Profile Section */
          <div className="flex items-center gap-3 cursor-pointer hover:bg-indigo-600 p-2 rounded-lg transition">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{user.name} {user.surname}</p>
            </div>
            {/* Profile Picture Placeholder */}
            <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center border border-indigo-400">
              <span className="text-sm font-bold">{user.name[0]}{user.surname[0]}</span>
            </div>
          </div>
        ) : (
         <button 
  onClick={handleLogin} 
  className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-50 transition active:scale-95"
>
  Login
</button>
        )}
      </div>
    </div>
  );
}

export default TopBar;