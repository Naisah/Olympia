import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Calendar, LayoutDashboard, Hospital, PawPrint, FileText, CreditCard, Newspaper, Image as ImageIcon, Building, Users, Home, LogOut, RefreshCw, Search, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';
import AdminNews from '../components/AdminNews';
import AdminGallery from '../components/AdminGallery';
import AdminBusinesses from '../components/AdminBusinesses';
import AdminIdentityReviews from '../components/AdminIdentityReviews';

const STATUS_COLORS = {
  'Pending':          'bg-orange-100 text-orange-700 border-orange-200',
  'Processing':       'bg-blue-100 text-blue-700 border-blue-200',
  'Ready for Pick-up':'bg-purple-100 text-purple-700 border-purple-200',
  'Completed':        'bg-green-100 text-green-700 border-green-200',
  'Reviewing':        'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Approved':         'bg-green-100 text-green-700 border-green-200',
  'Rejected':         'bg-red-100 text-red-700 border-red-200',
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
    {status}
  </span>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [docFilter, setDocFilter] = useState('all');
  const [toast, setToast] = useState({ visible: false, title: '', message: '', success: true });
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);

  
  const [healthQueue, setHealthQueue] = useState([]);
  const [facilityQueue, setFacilityQueue] = useState([]);
  const [docsQueue, setDocsQueue] = useState([]);
  const [animalQueue, setAnimalQueue] = useState([]);
  const [philhealthQueue, setPhilhealthQueue] = useState([]);
  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const showToast = useCallback((title, message, success = true) => {
    setToast({ visible: true, title, message, success });
    setTimeout(() => setToast({ visible: false, title: '', message: '', success: true }), 3000);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setHealthQueue(res.data.healthQueue || []);
      setFacilityQueue(res.data.facilityQueue || []);
      setDocsQueue(res.data.docsQueue || []);
      setAnimalQueue(res.data.animalQueue || []);
      setPhilhealthQueue(res.data.philhealthQueue || []);
      
      
      const resData = await api.get('/admin/residents');
      setResidents(resData.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
      showToast('Error', 'Could not load dashboard data.', false);
    } finally {
      setLoading(false);
    }
  }, [navigate, showToast]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    api.get('/user').then(res => setAdminName(res.data.user?.name || 'Admin')).catch(() => {});
    const load = async () => {
      await Promise.resolve();
      await fetchDashboard();
    };
    load();
  }, [navigate, fetchDashboard]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  const updateDocStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/document/${id}/status`, { status: newStatus });
      setDocsQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      showToast('Updated', `Status changed to "${newStatus}".`);
    } catch {
      showToast('Error', 'Could not update status.', false);
    }
  };

  const updateServiceStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/service/${id}/status`, { status: newStatus });
      setHealthQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setFacilityQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setAnimalQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setPhilhealthQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      showToast('Updated', `Status changed to "${newStatus}".`);
    } catch {
      showToast('Error', 'Could not update status.', false);
    }
  };

  const residentName = (item) => {
    if (item.resident) {
      return `${item.resident.first_name || ''} ${item.resident.last_name || ''}`.trim();
    }
    return 'Unknown Resident';
  };

  // Search filter helper
  const applySearch = (queue) => {
    if (!searchQuery.trim()) return queue;
    const q = searchQuery.toLowerCase();
    return queue.filter(item => {
      const name = residentName(item).toLowerCase();
      const tracking = (item.tracking_number || '').toLowerCase();
      const service = (item.service?.name || item.document_type?.name || '').toLowerCase();
      return name.includes(q) || tracking.includes(q) || service.includes(q);
    });
  };

  const filteredHealth    = applySearch(healthQueue);
  const filteredFacility  = applySearch(facilityQueue);
  const filteredDocs      = applySearch(docsQueue);
  const filteredAnimal    = applySearch(animalQueue);
  const filteredPhilhealth = applySearch(philhealthQueue);
  const filteredResidents = searchQuery.trim()
    ? residents.filter(r => {
        const name = `${r.first_name} ${r.last_name}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase()) || (r.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      })
    : residents;
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
  
  const trendData = (() => {
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
  })();

  const navItems = [
    { key: 'all',           icon: <LayoutDashboard size={20} />,  label: 'Dashboard',          section: null },
    { key: 'health',        icon: <Hospital size={20} />, label: 'Health & Medical',    section: 'Citizen Services' },
    { key: 'animal',        icon: <PawPrint size={20} />, label: 'Animal Clinic',       section: null },
    { key: 'facility',      icon: <Activity size={20} />, label: 'Facility Booking',    section: null },
    { key: 'docs',          icon: <FileText size={20} />, label: 'Document Requests',   section: null },
    { key: 'philhealth',    icon: <CreditCard size={20} />, label: 'PhilHealth Desk',     section: null },
    { key: 'news',          icon: <Newspaper size={20} />, label: 'Manage News',         section: 'Content Management' },
    { key: 'gallery',       icon: <ImageIcon size={20} />, label: 'Manage Gallery',      section: null },
    { key: 'businesses',    icon: <Building size={20} />, label: 'Manage Businesses',   section: null },
    { key: 'records',       icon: <Users size={20} />, label: 'Resident Records',    section: 'Records' },
    { key: 'identity',      icon: <CheckCircle size={20} />, label: 'Identity Reviews', section: null },
  ];

  return (
    <div className="bg-gray-50 font-sans text-customBlack h-screen flex overflow-hidden">
      
      <aside className="w-64 bg-customDarkBlue text-white flex-col hidden md:flex h-full shadow-xl z-20 flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="text-2xl mr-3"><Building size={24}/></div>
          <div>
            <h1 className="text-lg font-extrabold tracking-wide">Brgy. Olympia</h1>
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-1 px-4 scrollbar-hide">
          {navItems.map((item) => (
            <React.Fragment key={item.key}>
              {item.section && (
                <p className="px-4 pt-4 pb-2 text-xs font-bold text-blue-300 uppercase tracking-widest">{item.section}</p>
              )}
              <button
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${activeTab === item.key ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'} ${item.key === 'all' ? 'mb-2 font-bold shadow-sm' : ''}`}
              >
                <span className="text-lg">{item.icon}</span> {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-bold text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <Home size={20} />
            Return to Main Site
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20">
            <div className="w-8 h-8 rounded-full bg-customYellow flex items-center justify-center text-customBlack font-bold text-sm">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{adminName}</p>
              <p className="text-xs text-blue-300">Desk Officer</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-blue-300 hover:text-white transition-colors ml-1">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <div><h2 className="text-2xl font-extrabold text-customDarkBlue">Admin Workspace</h2>
            <select aria-label="Admin section" className="md:hidden border rounded mt-1 p-1 max-w-44" value={activeTab} onChange={event => setActiveTab(event.target.value)}>
              {navItems.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select></div>
          <div className="flex items-center gap-4">
            <button onClick={fetchDashboard} title="Refresh" className="text-gray-400 hover:text-customBlue transition-colors">
              <RefreshCw size={20} />
            </button>
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search residents or tracking numbers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-72 bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-customBlue outline-none"
              />
              <Search size={16} className="text-gray-400 absolute left-4 top-2.5" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 space-y-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
              <RefreshCw className="w-10 h-10 animate-spin text-customBlue" />
              <p className="text-sm font-semibold">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              
              
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
                                  <Cell key={`cell-${index}`} fill={entry.color} />
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

              {(activeTab === 'health' || activeTab === 'all') && (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-xl font-extrabold text-customDarkBlue flex items-center gap-2">🏥 Health Reservations Queue</h3>
                    <p className="text-sm text-gray-500 mt-1">Review and manage incoming health service appointments.</p>
                  </div>
                  {filteredHealth.length === 0 ? (
                    <div className="px-8 py-12 text-center text-gray-400">
                      <div className="text-3xl mb-2"><CheckCircle size={48} className="mx-auto" /></div>
                      <p className="font-semibold">No pending health reservations.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-8 py-4 font-bold">Resident Name</th>
                            <th className="px-8 py-4 font-bold">Service</th>
                            <th className="px-8 py-4 font-bold">Date</th>
                            <th className="px-8 py-4 font-bold">Status</th>
                            <th className="px-8 py-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {filteredHealth.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-customBlack">{residentName(item)}</td>
                              <td className="px-8 py-5 text-gray-600">{item.service?.name || '—'}</td>
                              <td className="px-8 py-5 text-gray-700">{item.reservation_date || '—'}</td>
                              <td className="px-8 py-5"><StatusBadge status={item.status} /></td>
                              <td className="px-8 py-5 text-right space-x-2">
                                <button onClick={() => openDetailsModal(item)} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">View</button>
                                {item.status === 'Pending' && <button onClick={() => updateServiceStatus(item.id, 'Processing')} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-600 transition-colors">Mark Processing</button>}
                                {item.status === 'Processing' && <button onClick={() => updateServiceStatus(item.id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-green-600 transition-colors">Approve & Notify</button>}
                                {item.status === 'Approved' && <button onClick={() => updateServiceStatus(item.id, 'Completed')} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-black transition-colors">Mark Completed</button>}
                                {item.status === 'Completed' && <span className="text-xs text-gray-400 font-bold uppercase">Resolved</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              
              {(activeTab === 'facility' || activeTab === 'all') && (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-blue-50/50">
                    <h3 className="text-xl font-extrabold text-customBlue flex items-center gap-2"><Activity size={24} className="text-customYellow" /> Facility Booking Requests</h3>
                    <p className="text-sm text-blue-600 mt-1">Review reservations for the Barangay Covered Court.</p>
                  </div>
                  {filteredFacility.length === 0 ? (
                    <div className="px-8 py-12 text-center text-gray-400">
                      <div className="text-3xl mb-2"><CheckCircle size={48} className="mx-auto" /></div>
                      <p className="font-semibold">No pending facility bookings.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-8 py-4 font-bold">Requestor</th>
                            <th className="px-8 py-4 font-bold">Facility</th>
                            <th className="px-8 py-4 font-bold">Date</th>
                            <th className="px-8 py-4 font-bold">Status</th>
                            <th className="px-8 py-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {filteredFacility.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-customBlack">{residentName(item)}</td>
                              <td className="px-8 py-5 text-gray-600 font-semibold">{item.service?.name || '—'}</td>
                              <td className="px-8 py-5 text-gray-700">{item.reservation_date || '—'}</td>
                              <td className="px-8 py-5"><StatusBadge status={item.status} /></td>
                              <td className="px-8 py-5 text-right space-x-2">
                                <button onClick={() => openDetailsModal(item)} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">View</button>
                                {item.status === 'Pending' && (
                                  <>
                                    <button onClick={() => updateServiceStatus(item.id, 'Rejected')} className="bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-red-600 transition-colors">Reject</button>
                                    <button onClick={() => updateServiceStatus(item.id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-green-600 transition-colors">Approve Slot</button>
                                  </>
                                )}
                                {item.status === 'Approved' && <button onClick={() => updateServiceStatus(item.id, 'Completed')} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-black transition-colors">Mark Completed</button>}
                                {(item.status === 'Completed' || item.status === 'Rejected') && <span className="text-xs text-gray-400 font-bold uppercase ml-2">Resolved</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              
              {(activeTab === 'docs' || activeTab === 'all') && (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-extrabold text-customDarkBlue flex items-center gap-2">📄 Document Requests</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Review, process, and issue official barangay documents.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm flex-wrap">
                      {['all', 'Reviewing', 'Processing', 'Ready for Pick-up', 'Completed'].map(f => (
                        <button key={f} onClick={() => setDocFilter(f)} className={`${docFilter === f ? 'bg-customBlue text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'} px-4 py-1.5 rounded-full font-bold shadow-sm transition-colors`}>
                          {f === 'all' ? 'All Docs' : f}
                        </button>
                      ))}
                    </div>
                  </div>
                  {filteredDocs.filter(item => docFilter === 'all' || item.status === docFilter).length === 0 ? (
                    <div className="px-8 py-12 text-center text-gray-400">
                      <div className="text-3xl mb-2"><CheckCircle size={48} className='mx-auto' /></div>
                      <p className="font-semibold">No document requests in this category.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-8 py-4 font-bold">Resident Name</th>
                            <th className="px-8 py-4 font-bold">Document Type</th>
                            <th className="px-8 py-4 font-bold">Purpose</th>
                            <th className="px-8 py-4 font-bold">Status</th>
                            <th className="px-8 py-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {filteredDocs.filter(item => docFilter === 'all' || item.status === docFilter).map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-customBlack">{residentName(item)}</td>
                              <td className="px-8 py-5 font-bold text-customBlue">{item.document_type?.name || '—'}</td>
                              <td className="px-8 py-5 text-gray-600 text-xs">{item.purpose || '—'}</td>
                              <td className="px-8 py-5"><StatusBadge status={item.status} /></td>
                              <td className="px-8 py-5 text-right space-x-2">
                                <button onClick={() => openDetailsModal(item)} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">View</button>
                                {item.status === 'Pending' && <button onClick={() => updateDocStatus(item.id, 'Reviewing')} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-600 transition-colors">Start Review</button>}
                                {['Pending', 'Reviewing'].includes(item.status) && <button onClick={() => updateDocStatus(item.id, 'Processing')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-green-600 transition-colors">Approve</button>}
                                {item.status === 'Processing' && <button onClick={() => updateDocStatus(item.id, 'Ready for Pick-up')} className="bg-customDarkBlue text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-900 transition-colors">Mark Ready for Pick-up</button>}
                                {item.status === 'Ready for Pick-up' && <button onClick={() => updateDocStatus(item.id, 'Completed')} className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-black transition-colors">Mark Claimed</button>}
                                {item.status === 'Completed' && <span className="text-xs text-gray-400 font-bold uppercase ml-2">Resolved</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              
              {activeTab === 'news' && <AdminNews showToast={showToast} />}
              {activeTab === 'gallery' && <AdminGallery showToast={showToast} />}
              {activeTab === 'businesses' && <AdminBusinesses showToast={showToast} />}
              {activeTab === 'identity' && <AdminIdentityReviews showToast={showToast} />}

              
              {(activeTab === 'animal' || activeTab === 'all') && (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-xl font-extrabold text-customDarkBlue flex items-center gap-2">🐾 Animal Clinic Queue</h3>
                    <p className="text-sm text-gray-500 mt-1">Review and manage incoming veterinary service appointments.</p>
                  </div>
                  {filteredAnimal.length === 0 ? (
                    <div className="px-8 py-12 text-center text-gray-400">
                      <div className="text-3xl mb-2"><CheckCircle size={48} className='mx-auto' /></div>
                      <p className="font-semibold">No pending animal clinic reservations.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-8 py-4 font-bold">Resident Name</th>
                            <th className="px-8 py-4 font-bold">Service</th>
                            <th className="px-8 py-4 font-bold">Date</th>
                            <th className="px-8 py-4 font-bold">Status</th>
                            <th className="px-8 py-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {filteredAnimal.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-customBlack">{residentName(item)}</td>
                              <td className="px-8 py-5 text-gray-600">{item.service?.name || '—'}</td>
                              <td className="px-8 py-5 text-gray-700">{item.reservation_date || '—'}</td>
                              <td className="px-8 py-5"><StatusBadge status={item.status} /></td>
                              <td className="px-8 py-5 text-right space-x-2">
                                <button onClick={() => openDetailsModal(item)} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">View</button>
                                {item.status === 'Pending' && <button onClick={() => updateServiceStatus(item.id, 'Processing')} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-600 transition-colors">Mark Processing</button>}
                                {item.status === 'Processing' && <button onClick={() => updateServiceStatus(item.id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-green-600 transition-colors">Approve</button>}
                                {item.status === 'Approved' && <button onClick={() => updateServiceStatus(item.id, 'Completed')} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-black transition-colors">Mark Completed</button>}
                                {item.status === 'Completed' && <span className="text-xs text-gray-400 font-bold uppercase">Resolved</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              
              {(activeTab === 'philhealth' || activeTab === 'all') && (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-xl font-extrabold text-customDarkBlue flex items-center gap-2">💳 PhilHealth Desk Queue</h3>
                    <p className="text-sm text-gray-500 mt-1">Review and manage PhilHealth assistance requests.</p>
                  </div>
                  {filteredPhilhealth.length === 0 ? (
                    <div className="px-8 py-12 text-center text-gray-400">
                      <div className="text-3xl mb-2"><CheckCircle size={48} className='mx-auto' /></div>
                      <p className="font-semibold">No pending PhilHealth requests.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-8 py-4 font-bold">Resident Name</th>
                            <th className="px-8 py-4 font-bold">Service</th>
                            <th className="px-8 py-4 font-bold">Date</th>
                            <th className="px-8 py-4 font-bold">Status</th>
                            <th className="px-8 py-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {filteredPhilhealth.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-customBlack">{residentName(item)}</td>
                              <td className="px-8 py-5 text-gray-600">{item.service?.name || '—'}</td>
                              <td className="px-8 py-5 text-gray-700">{item.reservation_date || '—'}</td>
                              <td className="px-8 py-5"><StatusBadge status={item.status} /></td>
                              <td className="px-8 py-5 text-right space-x-2">
                                <button onClick={() => openDetailsModal(item)} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">View</button>
                                {item.status === 'Pending' && <button onClick={() => updateServiceStatus(item.id, 'Processing')} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-600 transition-colors">Process</button>}
                                {item.status === 'Processing' && <button onClick={() => updateServiceStatus(item.id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-green-600 transition-colors">Approve</button>}
                                {item.status === 'Approved' && <button onClick={() => updateServiceStatus(item.id, 'Completed')} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-black transition-colors">Completed</button>}
                                {item.status === 'Completed' && <span className="text-xs text-gray-400 font-bold uppercase">Resolved</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              
              {activeTab === 'records' && (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-xl font-extrabold text-customDarkBlue flex items-center gap-2">👥 Resident Records</h3>
                    <p className="text-sm text-gray-500 mt-1">Directory of all registered barangay residents.</p>
                  </div>
                  {filteredResidents.length === 0 ? (
                    <div className="px-8 py-12 text-center text-gray-400">
                      <p className="font-semibold">No residents found.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-8 py-4 font-bold">Name</th>
                            <th className="px-8 py-4 font-bold">Email</th>
                            <th className="px-8 py-4 font-bold">Contact</th>
                            <th className="px-8 py-4 font-bold">Gender</th>
                            <th className="px-8 py-4 font-bold">Address</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {filteredResidents.map(resident => (
                            <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-customBlack">{resident.first_name} {resident.last_name}</td>
                              <td className="px-8 py-5 text-gray-600">{resident.email}</td>
                              <td className="px-8 py-5 text-gray-600">{resident.contact_number}</td>
                              <td className="px-8 py-5 text-gray-600">{resident.gender || '—'}</td>
                              <td className="px-8 py-5 text-gray-600 line-clamp-1">{resident.address}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        
        <div className={`absolute bottom-10 right-10 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 ${toast.visible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-24 opacity-0 pointer-events-none'} ${toast.success ? 'bg-gray-900 text-white' : 'bg-red-700 text-white'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.success ? 'bg-green-500' : 'bg-red-400'}`}>
            {toast.success
              ? <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            }
          </div>
          <div>
            <p className="font-bold text-sm">{toast.title}</p>
            <p className="text-xs opacity-80">{toast.message}</p>
          </div>
        </div>

        
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedItem && (
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full transform transition-all">
              <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-5">
                <h3 className="text-2xl font-extrabold text-customDarkBlue">Request Details</h3>
                <StatusBadge status={selectedItem.status} />
              </div>
              
              <div className="space-y-5 text-sm text-gray-800">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tracking Number</p>
                  <p className="font-mono bg-gray-50 border border-gray-200 p-2.5 rounded-lg mt-1 font-semibold text-customBlue inline-block">{selectedItem.tracking_number || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">First Name</p>
                    <p className="font-bold text-base">{selectedItem.resident?.first_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Name</p>
                    <p className="font-bold text-base">{selectedItem.resident?.last_name || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="font-semibold break-all">{selectedItem.resident?.email || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact No.</p>
                    <p className="font-semibold">{selectedItem.resident?.contact_number || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                    <p className="font-semibold">{selectedItem.resident?.gender || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                    <p className="font-semibold">{selectedItem.resident?.date_of_birth || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Home Address</p>
                  <p className="font-semibold">{selectedItem.resident?.address || 'N/A'}</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Service / Request Info</p>
                  <p className="font-black text-customDarkBlue text-lg">
                    {selectedItem.service?.name || selectedItem.document_type?.name || 'Unknown'}
                  </p>
                  {selectedItem.reservation_date && (
                    <p className="text-gray-700 mt-2 font-medium flex items-center gap-2">
                      <Calendar size={18} className="text-blue-400" /> {selectedItem.reservation_date}
                    </p>
                  )}
                  {selectedItem.purpose && (
                    <p className="text-gray-700 mt-2 font-medium flex items-start gap-2">
                      <span className="text-blue-400 text-lg">📝</span> {selectedItem.purpose}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-sm">
                  Close Details
                </button>
              </div>
            </div>
          )}
        </Modal>

      </main>
    </div>
  );
};

export default AdminDashboard;
