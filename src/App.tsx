import React from 'react';
import Layout from './components/Layout';
import { Activity, DollarSign, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

function App() {
  // Sample data
  const recentActivities = [
    { id: 1, title: 'Kasus baru ditambahkan', time: '5 menit yang lalu', type: 'case' },
    { id: 2, title: 'Pengembalian berhasil', time: '1 jam yang lalu', type: 'return' },
    { id: 3, title: 'Kerugian baru dilaporkan', time: '2 jam yang lalu', type: 'loss' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="gradient-card rounded-xl shadow-card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Kerugian</p>
                  <p className="text-2xl font-bold text-slate-900">Rp 250.000.000</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-500 font-semibold">12%</span>
                <span className="text-slate-500 ml-2">dari bulan lalu</span>
              </div>
            </div>
          </div>

          <div className="gradient-card rounded-xl shadow-card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Pengembalian</p>
                  <p className="text-2xl font-bold text-slate-900">Rp 150.000.000</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-semibold">8%</span>
                <span className="text-slate-500 ml-2">dari bulan lalu</span>
              </div>
            </div>
          </div>

          <div className="gradient-card rounded-xl shadow-card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Kasus Aktif</p>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-500 font-semibold">5%</span>
                <span className="text-slate-500 ml-2">dari bulan lalu</span>
              </div>
            </div>
          </div>

          <div className="gradient-card rounded-xl shadow-card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Kasus Selesai</p>
                  <p className="text-2xl font-bold text-slate-900">18</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 text-indigo-500 mr-1" />
                <span className="text-indigo-500 font-semibold">15%</span>
                <span className="text-slate-500 ml-2">dari bulan lalu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="gradient-card rounded-xl shadow-card">
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
            <div className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'case' ? 'bg-blue-100' :
                    activity.type === 'return' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {activity.type === 'case' && <Activity className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'return' && <DollarSign className="w-5 h-5 text-emerald-600" />}
                    {activity.type === 'loss' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;