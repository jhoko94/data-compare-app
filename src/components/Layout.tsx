// layout.tsx
import React from 'react';
import { Menu, Bell, LogOut, Home, FileText, Users, Shield, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Data Compare', icon: FileText, to: '/data-compare' },
    { name: 'Log Data Compare', icon: FileText, to: '/log-data-compare' },
  ];

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 gradient-sidebar shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        {/* <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h1 className="text-xl font-black text-white">TGR System</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <Menu className="w-6 h-6 text-slate-300" />
          </button>
        </div> */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out min-h-screen`}>
        {/* Top Navigation */}
        <header className="gradient-header shadow-card">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex items-center space-x-6">
              {/* <button className="relative">
                <Bell className="w-6 h-6 text-slate-600 hover:text-slate-800 transition-colors" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-9 h-9 rounded-full ring-2 ring-white"
                />
                <span className="text-sm font-semibold text-slate-700">John Doe</span>
              </div> */}
              <button className="text-slate-600 hover:text-slate-800 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}