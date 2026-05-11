import { useState, useEffect } from 'react';

function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        if (isRegister) {
          setIsRegister(false);
          alert('Registered! Please login.');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUserData(data.user);
          setIsLoggedIn(true);
          setShowModal(false);
        }
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Backend connection failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
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
              <span className="text-xs font-bold text-white leading-none">{userData?.name || 'User'}</span>
              <button onClick={handleLogout} className="text-[10px] text-dusk-end hover:underline text-left">Logout</button>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-warm-start to-warm-end p-[2px] shadow-lg shadow-warm-start/10">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                {userData?.name ? userData.name[0].toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-dusk-start to-dusk-end text-white text-xs font-bold hover:scale-105 transition shadow-lg shadow-dusk-start/20"
          >
            Login Access
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-dusk-start to-dusk-end"></div>
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition text-xl"
            >✕</button>

            <h2 className="text-2xl font-bold text-white mb-2 italic">
              {isRegister ? 'Join the System' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-sm mb-8">Access your personalized dashboard</p>

            <form onSubmit={handleAuth} className="space-y-4">
              {isRegister && (
                <input 
                  type="text" placeholder="Full Name" required
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-dusk-start outline-none transition"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              )}
              <input 
                type="email" placeholder="Email Address" required
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-dusk-start outline-none transition"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="password" placeholder="Password" required
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-dusk-start outline-none transition"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-dusk-start to-dusk-end text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-dusk-start/20 hover:scale-[1.02] active:scale-95 transition mt-4"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-8">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-dusk-end font-bold hover:underline"
              >
                {isRegister ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default TopBar;