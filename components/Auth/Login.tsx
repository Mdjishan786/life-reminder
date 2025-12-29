
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, AlertCircle, Smartphone, Loader2, MessageSquare } from 'lucide-react';
import { getUsers, setActiveUserId } from '../../store';
import { User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = getUsers();
    const user = users.find(u => u.email === identifier || u.mobile === identifier || `+91${u.mobile}` === identifier || identifier.endsWith(u.mobile));

    if (!user) {
      setError('User not found. Please sign up first.');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password.');
      return;
    }

    setLoading(true);
    
    // Simulate network delay for "Sending OTP"
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setLoading(false);
      setStep('otp');
      setTimer(30);
      
      // Trigger the realistic "Virtual SMS" notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 8000);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      const users = getUsers();
      const user = users.find(u => u.email === identifier || u.mobile === identifier || `+91${u.mobile}` === identifier || identifier.endsWith(u.mobile));
      if (user) {
        setActiveUserId(user.id);
        onLogin(user);
      }
    } else {
      setError('Invalid OTP. Please check your notification.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5 overflow-hidden">
      
      {/* REALISTIC SMS NOTIFICATION SIMULATION */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in slide-in-from-top-full duration-500">
          <div className="bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-white/10 flex gap-4 items-start">
            <div className="bg-green-500 p-2 rounded-2xl">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">LifeFlow Auth</span>
                <span className="text-[10px] text-white/40 font-bold">Just Now</span>
              </div>
              <p className="text-sm font-bold">Your LifeFlow login OTP is <span className="text-green-400 underline decoration-2 underline-offset-4">{generatedOtp}</span>. Do not share this with anyone.</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-green-100 border border-gray-100 relative">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-green-500 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-green-200 mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">LifeFlow</h1>
          <p className="text-gray-400 font-medium tracking-tight">Login Securely</p>
        </div>

        {step === 'info' ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile or Email</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  placeholder="9876543210"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">India (+91) format supported</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</> : 'Request OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-4">
              <p className="font-bold text-gray-700 uppercase tracking-widest text-xs mb-1">Enter 4-Digit OTP</p>
              <p className="text-xs text-gray-400 font-medium">Wait for the notification to appear above</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <input 
              type="text" 
              maxLength={4}
              autoFocus
              required
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
              className="w-full text-center text-3xl tracking-[1em] bg-gray-50 border-none rounded-3xl py-6 focus:ring-2 focus:ring-green-500 font-black shadow-inner"
              placeholder="0000"
            />

            <div className="text-center">
               {timer > 0 ? (
                 <p className="text-xs font-bold text-gray-400">Resend OTP in <span className="text-green-500">{timer}s</span></p>
               ) : (
                 <button type="button" onClick={handleRequestOtp} className="text-xs font-black text-green-600 hover:underline">Resend OTP Now</button>
               )}
            </div>

            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-200 transition-all active:scale-95"
            >
              Verify & Login
            </button>

            <button 
              type="button"
              onClick={() => setStep('info')}
              className="w-full text-gray-400 text-xs font-bold hover:text-gray-600"
            >
              Wrong mobile number? Go back
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-500 font-bold">
            Don't have an account? <Link to="/signup" className="text-green-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
