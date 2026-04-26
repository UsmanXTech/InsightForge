import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Legend, Brush } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/Table';
// Removal of mockData import
import { Download, Filter, SlidersHorizontal, Users, DollarSign, TrendingUp, Activity, Search, GripVertical, LayoutTemplate, Save, Trash2, X, Maximize2, UploadCloud, Sparkles, Loader2 } from 'lucide-react';
import { Reorder } from 'motion/react';

export function Dashboard() {
  // Feature 1: Advanced Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Live Data State
  const [salesData, setSalesData] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);

  // AI Insights State
  const [isUploading, setIsUploading] = useState(false);
  const [aiInsights, setAiInsights] = useState<{filename: string, rows: number, insights: string} | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/insights/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setAiInsights(data);
      } else {
        alert("AI Insights Failed: " + data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Network error during file upload.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/approve`, { method: 'PUT' });
      if (res.ok) {
        // Refresh users data
        fetch('/api/users').then(r => r.json()).then(setTransactionsData).catch(console.error);
      }
    } catch (err) {
      console.error("Failed to approve user", err);
    }
  };

  useEffect(() => {
    fetch('/api/sales').then(r => r.json()).then(setSalesData).catch(console.error);
    fetch('/api/projects').then(r => r.json()).then(setProjectData).catch(console.error);
    fetch('/api/users').then(r => r.json()).then(setTransactionsData).catch(console.error);
  }, []);

  const filteredTransactions = transactionsData.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? t.role === roleFilter : true;
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  }).slice(0, 10);

  // Feature 2: Custom Layouts
  const defaultLayout = ['kpis', 'charts', 'table'];
  const [layout, setLayout] = useState(defaultLayout);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [viewName, setViewName] = useState('');
  const [savedViews, setSavedViews] = useState<{id: string, name: string, layout: string[]}[]>([]);
  const [currentViewId, setCurrentViewId] = useState('default');
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('insightforge_views');
    if (stored) {
      try {
        setSavedViews(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const saveView = () => {
    if (!viewName.trim()) return;
    const newView = { id: Date.now().toString(), name: viewName, layout };
    const updated = [...savedViews, newView];
    setSavedViews(updated);
    localStorage.setItem('insightforge_views', JSON.stringify(updated));
    setCurrentViewId(newView.id);
    setIsEditingLayout(false);
    setViewName('');
  };

  const loadView = (id: string) => {
    setCurrentViewId(id);
    if (id === 'default') {
      setLayout(defaultLayout);
      return;
    }
    const view = savedViews.find(v => v.id === id);
    if (view) {
      setLayout(view.layout);
    }
  };

  const deleteView = () => {
    if (currentViewId === 'default') return;
    const updated = savedViews.filter(v => v.id !== currentViewId);
    setSavedViews(updated);
    localStorage.setItem('insightforge_views', JSON.stringify(updated));
    setCurrentViewId('default');
    setLayout(defaultLayout);
  };

  // Block Renderers
  const renderKPIs = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-serif">$45,231.89</div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-serif">+2350</div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Data Queries</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-serif">+12,234</div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">+19% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Processing Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-serif">573 mb/s</div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">+201 since last hour</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCharts = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-1 lg:col-span-4 group">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue & Usage Trends</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setExpandedChart('trends')}>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRev)" />
              <Brush dataKey="name" height={25} stroke="var(--muted-foreground)" fill="var(--background)" wrapperStyle={{ borderRadius: '4px' }} tickFormatter={(val) => ''} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-3 group">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quarterly Budget</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setExpandedChart('budget')}>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} />
              <RechartsTooltip cursor={{fill: 'var(--muted)', opacity: 0.4}} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '8px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
              <Bar dataKey="budget" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" fill="var(--foreground)" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const exportToCSV = () => {
    // Generate CSV content from filteredTransactions or transactionsData
    // Let's use filteredTransactions so it respects current filters/search, 
    // or you could use transactionsData to download everything. We'll use filtered.
    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Last Login'];
    const csvRows = [headers.join(',')];

    for (const tx of transactionsData) { // export all data, not just filtered view top 10
      csvRows.push([
        tx.id,
        `"${tx.name}"`, // Quote fields that might contain commas
        `"${tx.email}"`,
        `"${tx.role}"`,
        `"${tx.department}"`,
        `"${tx.status}"`,
        `"${tx.lastLogin}"`
      ].join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'insightforge_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = () => (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/50">
        <div className="flex items-center gap-4">
            <CardTitle>Dataset Records</CardTitle>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={exportToCSV} title="Export to CSV">
                <Download className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {showFilters && (
            <div className="flex items-center gap-2">
              <select 
                className="h-8 px-2 text-xs font-semibold bg-background/50 border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
              <select 
                className="h-8 px-2 text-xs font-semibold bg-background/50 border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-9 w-[180px] lg:w-[250px] h-8 text-xs bg-background/50 border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <button 
            className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${showFilters ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-3 w-3" />
            Filter
          </button>
        </div>
      </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10 hover:bg-primary/10">
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">ID</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">User</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Role</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Department</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Status</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider font-bold">Last Login</TableHead>
              <TableHead className="text-center text-[11px] uppercase tracking-wider font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{tx.name}</div>
                  <div className="text-xs text-muted-foreground">{tx.email}</div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{tx.role}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{tx.department}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${tx.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' 
                    : tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}
                  `}>
                    {tx.status}
                  </span>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap font-serif text-foreground">
                  {tx.lastLogin}
                </TableCell>
                <TableCell className="text-center">
                  {tx.status === 'Pending' && (
                    <Button variant="outline" size="sm" className="h-6 text-[10px] font-bold border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleApproveUser(tx.id)}>
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm italic">
                  No matching records found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderBlock = (id: string) => {
    switch(id) {
      case 'kpis': return renderKPIs();
      case 'charts': return renderCharts();
      case 'table': return renderTable();
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-card/30 p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-4xl font-serif font-light text-foreground">Performance Overview</h1>
          <p className="text-sm text-muted-foreground italic mt-2">Displaying and customizing core metrics.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {isEditingLayout ? (
            <div className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg shadow-sm">
              <Input
                value={viewName}
                onChange={e => setViewName(e.target.value)}
                placeholder="Enter View Name..."
                className="h-8 w-40 text-xs font-semibold"
              />
              <Button size="sm" variant="ghost" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => setIsEditingLayout(false)}>
                <X className="h-3 w-3 mr-1" /> Cancel
              </Button>
              <Button size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:brightness-95" onClick={saveView}>
                <Save className="h-3 w-3 mr-1" /> Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <select 
                  className="h-9 pl-3 pr-8 text-xs font-bold uppercase tracking-widest bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground appearance-none cursor-pointer"
                  value={currentViewId}
                  onChange={(e) => loadView(e.target.value)}
                >
                  <option value="default">Default Layout</option>
                  {savedViews.map(view => (
                    <option key={view.id} value={view.id}>{view.name}</option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              </div>
              
              {currentViewId !== 'default' && (
                <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={deleteView} title="Delete saved view">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest text-foreground border-border ml-2 bg-background" onClick={() => setIsEditingLayout(true)}>
                <LayoutTemplate className="h-3 w-3 mr-2 text-primary" /> Edit Layout
              </Button>
              
              <div className="relative border-l border-border pl-2 ml-1">
                 <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                 <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-primary/20" onClick={() => document.getElementById('csv-upload')?.click()} disabled={isUploading}>
                   {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                   {isUploading ? 'Analyzing...' : 'AI Insights'}
                 </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {aiInsights && (
        <Card className="border-primary/50 shadow-lg shadow-primary/5 bg-primary/5 animate-in slide-in-from-top-4 fade-in duration-500">
          <CardHeader className="flex flex-row items-center border-b border-primary/10 pb-4">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <div className="flex-1">
              <CardTitle className="text-lg text-primary">AI Business Insights generated by Gemini</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Based on `{aiInsights.filename}` ({aiInsights.rows} rows analyzed)</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setAiInsights(null)} className="h-8 w-8 hover:bg-primary/20 text-primary transition-colors">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium">
              {aiInsights.insights.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                const isHeading = line.startsWith('**') || line.startsWith('###');
                return (
                  <p key={i} className={`mb-2 ${isHeading ? 'text-primary font-bold mt-4' : 'opacity-90'}`}>
                    {line.replace(/\*\*/g, '').replace(/###/g, '').replace(/\*/g, '•')}
                  </p>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Layout Engine */}
      {isEditingLayout ? (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 overflow-hidden">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
            <GripVertical className="h-4 w-4" /> Editing Layout Mode
          </div>
          <Reorder.Group axis="y" values={layout} onReorder={setLayout} className="space-y-4">
            {layout.map((blockId) => (
              <Reorder.Item key={blockId} value={blockId} className="relative cursor-move bg-background shadow-lg ring-1 ring-border rounded-xl p-2 select-none">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-primary px-3 py-1 rounded-full shadow-sm text-primary-foreground">
                  <GripVertical className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Drag to Reorder</span>
                </div>
                <div className="opacity-60 pointer-events-none pt-4">
                  {renderBlock(blockId)}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        <div className="space-y-6">
          {layout.map((blockId) => (
            <div key={blockId}>
              {renderBlock(blockId)}
            </div>
          ))}
        </div>
      )}

      {/* Expanded Chart Modal */}
      {expandedChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-8">
          <Card className="w-full h-full max-w-6xl max-h-[800px] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-card/50 px-6 py-4">
              <CardTitle className="text-xl">
                {expandedChart === 'trends' ? 'Revenue & Usage Trends' : 'Quarterly Budget'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setExpandedChart(null)} className="h-8 w-8 hover:bg-muted">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-6 min-h-[400px]">
              {expandedChart === 'trends' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorRevModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} dx={-10} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevModal)" />
                    <Area type="monotone" dataKey="users" stroke="var(--muted-foreground)" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                    <Legend verticalAlign="top" height={36} />
                    <Brush dataKey="name" height={30} stroke="var(--primary)" fill="var(--background)" wrapperStyle={{ borderRadius: '8px' }} tickFormatter={(val) => ''} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12}} dx={-10}/>
                    <RechartsTooltip cursor={{fill: 'var(--muted)', opacity: 0.4}} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '8px' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="budget" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                    <Bar dataKey="spend" fill="var(--foreground)" radius={[6, 6, 0, 0]} opacity={0.7} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
