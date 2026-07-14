import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Briefcase, FileCheck2, TrendingUp, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Temporary mock fetch, backend doesn't have a dedicated /stats route yet
      // You can implement an aggregator route in the future
      return {
        activeApplications: 12,
        averageAtsScore: 84,
        interviews: 2,
        aiOptimization: 'Excellent'
      };
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your job search progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Active Applications', icon: Briefcase, val: stats?.activeApplications, color: 'text-blue-500' },
          { title: 'Avg. ATS Score', icon: FileCheck2, val: stats?.averageAtsScore + '%', color: 'text-green-500' },
          { title: 'Interviews Scheduled', icon: TrendingUp, val: stats?.interviews, color: 'text-purple-500' },
          { title: 'AI Profile Strength', icon: Sparkles, val: stats?.aiOptimization, color: 'text-yellow-500' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  <div className="text-2xl font-bold">{item.val}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>You applied to 3 jobs this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Placeholder for activity list */}
               <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Applied to Senior Frontend Engineer</p>
                    <p className="text-sm text-muted-foreground">TechNova Inc. • 2 days ago</p>
                  </div>
                  <div className="ml-auto font-medium">Pending</div>
               </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Recommendations based on your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-primary/10 p-4 border border-primary/20">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-semibold">Skill Gap Detected</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Many roles you're matching with require <strong>GraphQL</strong>. Consider adding a project using GraphQL to your resume to increase your ATS score by ~12%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
