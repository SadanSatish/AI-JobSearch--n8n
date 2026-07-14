import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Server, Users, Activity, Settings2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const { data: health, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get('/system/health');
      return res.data;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-destructive">Admin Panel</h2>
        <p className="text-muted-foreground">System health, users, and Multi-Agent status.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 animate-pulse bg-muted rounded w-20" /> : (
              <div className="text-2xl font-bold text-green-500">
                {health?.status.toUpperCase()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Uptime: {health?.uptime ? Math.floor(health.uptime / 60) : 0} mins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Settings2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 animate-pulse bg-muted rounded w-20" /> : (
              <Badge variant={health?.database === 'connected' ? 'success' : 'destructive'}>
                {health?.database}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agent Runs (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,392</div>
            <p className="text-xs text-muted-foreground mt-1">98.2% Success Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Agent Activity (Logs)</CardTitle>
          <CardDescription>Real-time view into the Planner and Ranking agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="font-mono text-muted-foreground">ID: 0x932f</span>
                <span>JobSearchAgent</span>
                <Badge variant="success">Success</Badge>
                <span className="text-muted-foreground">320ms</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="font-mono text-muted-foreground">ID: 0x9330</span>
                <span>JobQualityAgent</span>
                <Badge variant="success">Success</Badge>
                <span className="text-muted-foreground">1.2s</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="font-mono text-muted-foreground">ID: 0x9331</span>
                <span>RankingAgent</span>
                <Badge variant="destructive">Failed</Badge>
                <span className="text-muted-foreground">OpenRouter Timeout</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
