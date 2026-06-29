import { useState } from 'react';
// IMPORT YOUR LOGO HERE (Change 'logo.jpg' to your actual file name)
import logo from '../assets/logo.jpg'; 

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onLogin({ email }); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
        
        {/* IMAGE LOGO SECTION */}
        <div className="flex justify-center mb-8">
          <img 
            src={logo} 
            alt="Project Logo" 
            className="h-16 w-auto object-contain" 
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email"
            className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 border border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 border border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl mt-4">
            {isLogin ? 'SIGN IN' : 'REGISTER'}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-violet-400 font-bold"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;