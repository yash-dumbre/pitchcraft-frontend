import React from 'react';

function Dashboard({ analytics, fetchAnalytics }) {
  return (
    <section className="w-full max-w-3xl bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-300">Performance Metrics Center</h2>
        <button onClick={fetchAnalytics} className="text-xs text-indigo-400 hover:underline">Force Sync</button>
      </div>

      {analytics.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No simulation runs tracked yet. Complete a pitch above to generate data logs.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.map((item, i) => (
            <div key={i} className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block truncate mb-2">{item._id}</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-800/50 p-2 rounded-lg">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Avg Score</span>
                  <span className="text-lg font-bold text-purple-400">{Math.round(item.averageScore)}%</span>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-lg">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Total Runs</span>
                  <span className="text-lg font-bold text-slate-300">{item.totalAttempts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;