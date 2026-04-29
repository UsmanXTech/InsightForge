import React, { useState, useEffect } from "react";
import { Activity, BellRing, Settings as SettingsIcon, TableProperties, CheckCircle2, Download, MessageSquare, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { apiFetch } from "@/src/lib/api";

export function DataExplorer() {
  const [activeDataset, setActiveDataset] = useState<'users' | 'sales' | 'projects'>('users');
  const [dataset, setDataset] = useState<any[]>([]);
  
  const [chatQuery, setChatQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    apiFetch(`/api/${activeDataset}`)
      .then(r => r.json())
      .then(setDataset)
      .catch(console.error);
  }, [activeDataset]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    setIsChatting(true);
    setChatResponse(null);
    try {
      const res = await apiFetch('/api/insights/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: chatQuery })
      });
      const data = await res.json();
      if (res.ok) {
        setChatResponse(data.answer);
      } else {
        setChatResponse(`Error: ${data.detail}`);
      }
    } catch (err) {
      console.error(err);
      setChatResponse("Failed to communicate with AI.");
    } finally {
      setIsChatting(false);
      setChatQuery("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-6 bg-card/30 p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-4xl font-serif font-light text-foreground">Data Explorer</h1>
          <p className="text-sm text-muted-foreground italic mt-2">Filter and inspect backend tables locally.</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['users', 'sales', 'projects'].map((tab) => (
              <Button
                key={tab}
                variant={activeDataset === tab ? 'default' : 'outline'}
                className="text-xs uppercase tracking-widest font-bold h-8"
                onClick={() => setActiveDataset(tab as any)}
              >
                {tab}
              </Button>
            ))}
          </div>
          
          <form onSubmit={handleAskAI} className="flex flex-1 sm:flex-none items-center gap-2 min-w-[280px]">
            <div className="relative flex-1">
              <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Ask AI about this data..." 
                className="pl-9 h-9 text-xs bg-background/50 border-primary/20 focus-visible:ring-primary w-full"
                value={chatQuery}
                onChange={e => setChatQuery(e.target.value)}
                disabled={isChatting}
              />
            </div>
            <Button type="submit" size="icon" className="h-9 w-9 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20" disabled={isChatting || !chatQuery.trim()}>
              {isChatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
      
      {chatResponse && (
        <Card className="border-primary/30 shadow-md shadow-primary/5 bg-primary/5 animate-in slide-in-from-top-4 fade-in duration-300">
          <CardContent className="p-4 flex gap-3">
            <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium">
               {chatResponse.split('\\n').map((line, i) => (
                  <p key={i} className="mb-1">{line}</p>
               ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase tracking-widest font-bold bg-primary/10">
              <tr>
                {dataset.length > 0 && Object.keys(dataset[0]).map(key => (
                  <th key={key} className="px-6 py-3">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dataset.map((row, i) => (
                <tr key={i} className="hover:bg-primary/5">
                  {Object.values(row).map((val: any, j) => (
                    <td key={j} className="px-6 py-4">{val !== null && val !== undefined ? val.toString() : ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {dataset.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">Loading dataset...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function Reports() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const downloadReport = async (endpoint: string) => {
    try {
      setIsDownloading(endpoint);
      const res = await apiFetch(`/api/${endpoint}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((obj: any) => Object.values(obj).join(',')).join('\\n');
        const csvContent = `${headers}\\n${rows}`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `InsightForge_${endpoint}_Report.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("No data available to export.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to compile report.");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-6 bg-card/30 p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-4xl font-serif font-light text-foreground">Analytics Reports</h1>
          <p className="text-sm text-muted-foreground italic mt-2">Export your database records locally as raw secure spreadsheets.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
           { ep: "sales", title: "Global Sales Ledger", desc: "Q1-Q4 Aggregate Revenue Sheets" },
           { ep: "projects", title: "Project Milestones", desc: "All system assignments and completion logs" },
           { ep: "users", title: "Identities Ledger", desc: "Compliance export of authorized dashboard identities" }
        ].map(report => (
          <Card key={report.ep} 
            className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-sm"
            onClick={() => downloadReport(report.ep)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">{report.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{report.desc}</p>
              </div>
              <Button size="icon" variant="outline" className="rounded-full flex-shrink-0" disabled={isDownloading === report.ep}>
                {isDownloading === report.ep ? <Activity className="h-4 w-4 animate-spin text-primary" /> : <Download className="h-4 w-4 text-primary" />}
              </Button>
            </CardHeader>
            <CardContent>
               <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Format: CSV Native</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/alerts`)
      .then(r => r.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-6 bg-card/30 p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-4xl font-serif font-light text-foreground">System Alerts</h1>
          <p className="text-sm text-muted-foreground italic mt-2">Live streamed security anomalies.</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {alerts.length > 0 ? alerts.map((a, i) => (
              <li key={i} className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-4">
                {a.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" /> : <BellRing className="h-5 w-5 text-yellow-500 mt-0.5" />}
                <div>
                  <h4 className="text-sm font-bold">{a.title}</h4>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <div className="ml-auto text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{a.time}</div>
              </li>
            )) : <li className="p-8 text-center text-muted-foreground text-sm">Waiting for connection...</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function Settings() {
  const [settings, setSettings] = useState<{key: string, value: string, enabled: boolean}[]>([]);

  useEffect(() => {
    apiFetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const toggleSetting = async (key: string, current: boolean) => {
    try {
      const res = await apiFetch(`/api/settings/${key}?enabled=${!current}`, { method: 'PUT' });
      if (res.ok) {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, enabled: !current } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-6 bg-card/30 p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-4xl font-serif font-light text-foreground">Global Settings</h1>
          <p className="text-sm text-muted-foreground italic mt-2">Control application preferences.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Configuration <span className="opacity-50 font-normal italic ml-2">Live Sync</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map(s => (
            <div key={s.key} className="flex justify-between items-center py-2 border-b border-border">
               <div>
                 <h4 className="font-bold text-sm capitalize">{s.key.replace('_', ' ')}</h4>
               </div>
               <div 
                 className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${s.enabled ? 'bg-primary' : 'bg-muted'}`}
                 onClick={() => toggleSetting(s.key, s.enabled)}
               >
                 <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${s.enabled ? 'left-5' : 'left-1'}`} />
               </div>
            </div>
          ))}
          {settings.length === 0 && <div className="text-center text-muted-foreground py-4">Loading settings...</div>}
        </CardContent>
      </Card>
    </div>
  );
}
