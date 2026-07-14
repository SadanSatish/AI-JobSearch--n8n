import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Building, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const columns = [
  { id: 'saved', title: 'Saved Jobs', color: 'bg-slate-500/10 border-slate-500/20' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'interviewing', title: 'Interviewing', color: 'bg-purple-500/10 border-purple-500/20' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-500/10 border-red-500/20' },
];

export default function ApplicationTracker() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs'); // Defined in Phase 4 JobController
      return res.data.data;
    }
  });

  // Mock data if empty
  const displayJobs = jobs?.length ? jobs : [
    { id: '1', title: 'Frontend Engineer', company: 'Acme Corp', status: 'saved', ats_score: 88, created_at: new Date().toISOString() },
    { id: '2', title: 'React Developer', company: 'GlobalTech', status: 'applied', ats_score: 92, created_at: new Date().toISOString() },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Application Tracker</h2>
        <p className="text-muted-foreground">Manage your job applications across different stages.</p>
      </div>

      <div className="flex-1 flex overflow-x-auto pb-4 gap-6">
        {columns.map((col) => (
          <div key={col.id} className={`flex flex-col min-w-[320px] rounded-xl border p-4 ${col.color}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{col.title}</h3>
              <Badge variant="secondary">
                {displayJobs?.filter((j: any) => j.status === col.id).length || 0}
              </Badge>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="h-24 bg-muted animate-pulse rounded-lg" />
              ) : (
                displayJobs?.filter((j: any) => j.status === col.id).map((job: any) => (
                  <Card key={job.id} className="cursor-grab active:cursor-grabbing hover-lift">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-semibold leading-tight">{job.title}</CardTitle>
                        <Badge variant={job.ats_score > 80 ? 'success' : 'secondary'} className="ml-2 shrink-0">
                          {job.ats_score}% ATS
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Building className="mr-1 h-3 w-3" />
                        {job.company || 'Unknown'}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        Added {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
