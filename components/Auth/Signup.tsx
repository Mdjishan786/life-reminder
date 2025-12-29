
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Lock, CheckCircle2, AlertCircle, Smartphone, Loader2, MessageSquare } from 'lucide-react';
import { getUsers, saveUsers, setActiveUserId, generateId } from '../../store';
import { User } from '../../types';

interface SignupProps {
  onSignup: (user: User) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validateMobile = (num: string) => {
    const regex = /^[6789]\d{9}$/;
    return regex.test(num.replace(/\D/g, ''));
  };

  const handleStartSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!validateMobile(formData.mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === formData.email || u.mobile === formData.mobile)) {
      setError('Email or Mobile already registered.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setLoading(false);
      setStep('otp');
      setTimer(30);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 8000);
    }, 1500);
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Check your notification.');
      return;
    }

    const newUser: User = {
      id: generateId(),
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      createdAt: Date.now()
    };

    const users = getUsers();
    saveUsers([...users, newUser]);
    setActiveUserId(newUser.id);
    onSignup(newUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5 overflow-hidden">
      
      {/* REALISTIC SMS NOTIFICATION SIMULATION */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in slide-in-from-top-full duration-500">
          <div className="bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-white/10 flex gap-4 items-start">
            <div className="bg-green-500 p-2 rounded-2xl">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">LifeFlow Verification</span>
                <span className="text-[10px] text-white/40 font-bold">Just Now</span>
              </div>
              <p className="text-sm font-bold">Your signup OTP is <span className="text-green-400 underline decoration-2 underline-offset-4">{generatedOtp}</span>. Happy planning!</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg bg-white p-10 rounded-[40px] shadow-2xl shadow-green-100 border border-gray-100">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Join LifeFlow</h1>
          <p className="text-gray-400 font-medium tracking-tight">Create your personal assistant</p>
        </div>

        {step === 'info' ? (
          <form onSubmit={handleStartSignup} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-5 py-4 font-medium focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="E.g. Jishan"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile (+91)</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="tel" required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-5 py-4 font-medium focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 hidden" /> {/* Hidden icon to maintain alignment if needed */}
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input 
                  type="password" required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm</label>
                <input 
                  type="password" required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Mobile...</> : 'Send OTP to Mobile'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCompleteSignup} className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center">
              <p className="font-bold text-gray-700 uppercase tracking-widest text-xs mb-1">Verify Mobile</p>
              <p className="text-xs text-gray-400 font-medium">OTP sent to +91 {formData.mobile}</p>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-sm font-bold">
                {error}
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
                 <p className="text-xs font-bold text-gray-400">Resend code in <span className="text-green-500">{timer}s</span></p>
               ) : (
                 <button type="button" onClick={handleStartSignup} className="text-xs font-black text-green-600 hover:underline">Resend OTP Now</button>
               )}
            </div>

            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-200 transition-all active:scale-95"
            >
              Verify & Create Account
            </button>

            <button 
              type="button"
              onClick={() => setStep('info')}
              className="w-full text-gray-400 text-xs font-bold hover:text-gray-600"
            >
              Edit Registration Details
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 font-bold">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
