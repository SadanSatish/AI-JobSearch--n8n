import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, MapPin, Building, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function JobSearch() {
  const [keyword, setKeyword] = useState('');
  
  // This would ideally hit a dedicated backend route that triggers the multi-agent search.
  // For the UI demonstration, we'll mock the state of a search.
  const { data: jobs, isPending, mutate: searchJobs } = useMutation({
    mutationFn: async (_q: string) => {
      // In production: return api.post('/agents/trigger-pipeline', { preferences: q })
      return new Promise<any[]>((resolve) => setTimeout(() => {
        resolve([
          { id: 1, title: 'Senior React Developer', company: 'TechNova', location: 'Remote', atsScore: 92, salary: '$120k-$150k' },
          { id: 2, title: 'Frontend Engineer (TypeScript)', company: 'GlobalCorp', location: 'New York, NY', atsScore: 85, salary: '$130k' },
        ])
      }, 1500));
    },
    onSuccess: () => {
      toast.success('Job search completed!');
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    searchJobs(keyword);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Job Search</h2>
        <p className="text-muted-foreground">Find highly optimized roles tailored to your resume.</p>
      </div>

      <Card className="glass-effect shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Job title, keywords, or preferences..."
                className="pl-9 h-12 text-lg"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 shadow-primary/20" disabled={isPending}>
              {isPending ? 'Searching...' : 'Find Jobs'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 pt-4">
        {isPending && (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted/50 rounded-t-xl" />
              </Card>
            ))}
          </div>
        )}

        {!isPending && jobs && jobs.map((job) => (
          <Card key={job.id} className="hover-lift overflow-hidden transition-all border-border/60">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className="flex items-center text-muted-foreground space-x-4 text-sm">
                    <span className="flex items-center"><Building className="mr-1 h-4 w-4"/> {job.company}</span>
                    <span className="flex items-center"><MapPin className="mr-1 h-4 w-4"/> {job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">ATS Match</div>
                    <div className="text-2xl font-bold text-green-500">{job.atsScore}%</div>
                  </div>
                  <Button variant="gradient" className="gap-2">
                    <Zap className="h-4 w-4" /> 1-Click Apply
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {!isPending && !jobs && (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Enter a keyword above to let the AI search agents find jobs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
