
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../constants';

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-green-200 dark:shadow-none mb-8 animate-float">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-5 h-5 text-green-200" />
        <span className="text-sm font-semibold uppercase tracking-wider text-green-100">Daily Motivation</span>
      </div>
      <p className="text-xl font-medium italic">"{quote}"</p>
    </div>
  );
};

export default MotivationalQuote;
