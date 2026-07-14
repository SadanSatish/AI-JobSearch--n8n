import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, FileText, Send, CheckCircle, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:5678/webhook/api/v1';
const HEADERS = {
  'Authorization': 'Bearer DEV_TOKEN_123',
  'x-user-id': '11111111-1111-1111-1111-111111111111'
};

export default function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const res = await axios.get(`${API_BASE}/dashboard/kpis`, { headers: HEADERS });
        setKpis(res.data.data);
      } catch (err) {
        console.error("Failed to load KPIs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Career Intelligence Hub</h1>
        <p className="text-gray-400 mt-2">Welcome back. Here is your pipeline overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 text-white shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Opportunities</h3>
            <Briefcase className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{kpis?.total_jobs_found || 0}</div>
          <p className="text-xs text-gray-400 mt-1">{kpis?.high_priority_jobs || 0} high priority</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 text-white shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Average ATS Score</h3>
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{kpis?.avg_ats_score || 0}/100</div>
          <p className="text-xs text-gray-400 mt-1">Across all evaluated jobs</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 text-white shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Ready to Apply</h3>
            <Send className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{kpis?.applications_ready || 0}</div>
          <p className="text-xs text-gray-400 mt-1">Application packages prepared</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 text-white shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Success Rate</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{kpis?.success_rate || 0}%</div>
          <p className="text-xs text-gray-400 mt-1">Interview invitations / submitted</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
         <div className="rounded-xl border border-gray-800 bg-gray-900 text-white shadow-sm p-6">
             <h3 className="font-semibold text-lg border-b border-gray-800 pb-2 mb-4">Pending Follow-ups</h3>
             <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-2"/> No urgent follow-ups today.
             </div>
         </div>
      </div>
    </div>
  );
}
