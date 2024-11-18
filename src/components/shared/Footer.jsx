import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Permanent_Marker } from 'next/font/google';
import Link from 'next/link';

const permanentMarker = Permanent_Marker({
    subsets: ["latin"],
    weight: "400", // You can adjust the weight if needed
  });

const Footer = () => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
          <Link href='/'><h2 className={`${permanentMarker.className} text-4xl `}>Hirex</h2></Link>
            <p className="text-gray-400 text-sm">
              Connecting talented professionals with innovative companies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-2">
              {['job-listing', 'post-job','about'].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors duration-300"/>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Connect With Us</h4>
            <div className="flex space-x-4">
              {[
                { icon: Github, href: '#', color: 'text-gray-300 hover:text-white' },
                { icon: Linkedin, href: '#', color: 'text-blue-400 hover:text-blue-500' },
                { icon: Twitter, href: '#', color: 'text-sky-400 hover:text-sky-500' }
              ].map(({ icon: Icon, href, color }) => (
                <Link
                  key={href} 
                  href={href} 
                  className={`${color} transition-colors duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;