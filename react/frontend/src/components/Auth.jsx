import { useState } from 'react';

function Auth({ onLogin }) {
  // Line 1: 'isLogin' state controls if we show Login or Register form.
  // Satır 1: 'isLogin' state'i Giriş mi yoksa Kayıt formunu mu göstereceğimizi belirler.
  const [isLogin, setIsLogin] = useState(true);

  // Line 2: States for the input fields.
  // Satır 2: Giriş alanları için state'ler.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload (Sayfanın yenilenmesini engeller)
    
    // Line 3: Send user data back to App.jsx.
    // Satır 3: Kullanıcı verisini App.jsx'e geri gönderir.
    onLogin({ email }); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
        <h1 className="text-3xl font-black text-white text-center mb-8 italic">
          TASK<span className="text-violet-500">MANAGER</span>
        </h1>
        
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