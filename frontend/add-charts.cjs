const fs = require('fs');

let file = 'src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add recharts imports
if (!content.includes('recharts')) {
  content = content.replace(
    /import \{ Activity, Calendar, LayoutDashboard/,
    "import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';\nimport { Activity, Calendar, LayoutDashboard"
  );
}

// 2. Add data aggregation logic inside AdminDashboard component before return
const aggregationLogic = `
  // Aggregated Analytics Data
  const totalRequests = healthQueue.length + facilityQueue.length + docsQueue.length + animalQueue.length + philhealthQueue.length;
  
  const allRequests = [...healthQueue, ...facilityQueue, ...docsQueue, ...animalQueue, ...philhealthQueue];
  const pendingRequests = allRequests.filter(req => req.status === 'Pending').length;
  const completedRequests = allRequests.filter(req => req.status === 'Completed').length;
  const totalResidents = residents.length;
  
  const pieData = [
    { name: 'Health', value: healthQueue.length, color: '#3b82f6' }, // blue
    { name: 'Facility', value: facilityQueue.length, color: '#f59e0b' }, // amber
    { name: 'Documents', value: docsQueue.length, color: '#10b981' }, // emerald
    { name: 'Animal Care', value: animalQueue.length, color: '#8b5cf6' }, // violet
    { name: 'PhilHealth', value: philhealthQueue.length, color: '#ec4899' }, // pink
  ].filter(item => item.value > 0);
  
  const statuses = ['Pending', 'Reviewing', 'Processing', 'Approved', 'Ready for Pick-up', 'Completed'];
  const barData = statuses.map(st => ({
    name: st,
    count: allRequests.filter(req => req.status === st).length
  })).filter(item => item.count > 0);
  
  const trendData = React.useMemo(() => {
    const dates = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
    }
    
    allRequests.forEach(req => {
      if(req.created_at) {
        const reqDate = new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if(dates[reqDate] !== undefined) {
          dates[reqDate]++;
        }
      }
    });
    
    return Object.keys(dates).map(date => ({
      date,
      Requests: dates[date]
    }));
  }, [healthQueue, facilityQueue, docsQueue, animalQueue, philhealthQueue]);
`;

if (!content.includes('const trendData')) {
  content = content.replace(
    /const navItems = \[/,
    aggregationLogic + '\n  const navItems = ['
  );
}

// 3. Add the Analytics View inside the return statement right before Health Reservations Queue
const overviewUI = `
              {activeTab === 'all' && (
                <div className="mb-10 space-y-8">
                  
                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-bold mb-1">Total Requests</p>
                        <h4 className="text-3xl font-black text-customDarkBlue">{totalRequests}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-customBlue">
                        <Activity size={24} />
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-bold mb-1">Pending Review</p>
                        <h4 className="text-3xl font-black text-orange-500">{pendingRequests}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <FileText size={24} />
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-bold mb-1">Completed</p>
                        <h4 className="text-3xl font-black text-emerald-500">{completedRequests}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <CheckCircle size={24} />
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-bold mb-1">Registered Residents</p>
                        <h4 className="text-3xl font-black text-purple-500">{totalResidents}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                        <Users size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Pie & Bar */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Service Distribution</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={\`cell-\${index}\`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                              />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Status Overview</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                              <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                              <RechartsTooltip
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              />
                              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Area Chart */}
                    <div className="lg:col-span-2">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Recent Activity Trend (Last 7 Days)</h3>
                        <div className="h-[550px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                              <RechartsTooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              />
                              <Area type="monotone" dataKey="Requests" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 my-8">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Queue Details Below</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>

                </div>
              )}
`;

if (!content.includes('Service Distribution')) {
  content = content.replace(
    /\{\(activeTab === 'health' \|\| activeTab === 'all'\) && \(/,
    overviewUI + "\n              {(activeTab === 'health' || activeTab === 'all') && ("
  );
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');
