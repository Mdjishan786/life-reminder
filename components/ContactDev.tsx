
import React from 'react';
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  Timer, 
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { DEVELOPER_INFO } from '../constants';

const ContactDev: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-200 mb-6">
            <UserCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black dark:text-white mb-2">Help & Support</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Have a question or suggestion? Get in touch with the developer directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* WhatsApp Card */}
          <a 
            href={`https://wa.me/${DEVELOPER_INFO.whatsapp.replace(/\D/g,'')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-900/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-green-600/60 uppercase tracking-widest">Chat on WhatsApp</p>
                <p className="font-bold dark:text-white">{DEVELOPER_INFO.whatsapp}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-green-300 ml-auto" />
            </div>
          </a>

          {/* Email Card */}
          <a 
            href={`mailto:${DEVELOPER_INFO.email}`}
            className="group bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-blue-600/60 uppercase tracking-widest">Email Support</p>
                <p className="font-bold dark:text-white">{DEVELOPER_INFO.email}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-300 ml-auto" />
            </div>
          </a>

          {/* Info Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Location</p>
              <p className="font-bold dark:text-white">{DEVELOPER_INFO.location}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-purple-500 shadow-sm">
              <Timer className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Response Time</p>
              <p className="font-bold dark:text-white">{DEVELOPER_INFO.responseTime}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Your privacy is 100% secured with LifeFlow.</span>
          </div>
          <p className="mt-6 text-sm font-medium text-gray-400">
            Developed by <span className="text-gray-900 dark:text-white font-black">{DEVELOPER_INFO.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactDev;
