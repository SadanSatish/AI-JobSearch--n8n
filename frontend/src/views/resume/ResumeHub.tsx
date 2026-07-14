import { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ResumeHub() {
  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await api.get('/ai/resume');
      return res.data.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/ai/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Resume parsed and optimized successfully!');
      // invalidate query
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      uploadMutation.mutate(file);
    } else {
      toast.error('Only PDF files are supported');
    }
  }, [uploadMutation]);

  // Mock ATS Data for visualization
  const atsData = [
    { name: 'Matched Skills', value: 85, color: '#10b981' },
    { name: 'Missing Keywords', value: 15, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resume Hub</h2>
        <p className="text-muted-foreground">Manage your resumes and view ATS optimization reports.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Resume</CardTitle>
            <CardDescription>Drag and drop a PDF to let the AI parse and optimize it.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-accent transition-colors flex flex-col items-center cursor-pointer"
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">Drag & Drop your PDF here</p>
              <p className="text-xs text-muted-foreground mb-4">Maximum file size 5MB</p>
              <Button variant="secondary" onClick={() => document.getElementById('file-upload')?.click()}>
                Browse Files
              </Button>
              <input 
                id="file-upload" 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) uploadMutation.mutate(e.target.files[0]);
                }} 
              />
            </div>
            {uploadMutation.isPending && (
              <div className="mt-4 text-center text-sm text-primary animate-pulse">
                AI is parsing and optimizing your resume...
              </div>
            )}
          </CardContent>
        </Card>

        {/* ATS Report Section */}
        <Card>
          <CardHeader>
            <CardTitle>ATS Optimization Report</CardTitle>
            <CardDescription>Analysis of your active Master Resume.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={atsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {atsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-full mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/> Formatted for Parsers</span>
                  <span className="font-medium text-green-500">Pass</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center"><AlertTriangle className="h-4 w-4 text-yellow-500 mr-2"/> Missing Soft Skills</span>
                  <span className="font-medium text-yellow-500">Warning</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resume History */}
      <Card>
        <CardHeader>
          <CardTitle>Resume History</CardTitle>
          <CardDescription>View your past uploaded versions.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="h-20 animate-pulse bg-muted rounded-md w-full" />
           ) : resumes?.length === 0 ? (
             <div className="text-center py-6 text-muted-foreground">No resumes found. Upload one above.</div>
           ) : (
             <div className="space-y-4">
                {resumes?.map((res: any) => (
                  <div key={res.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-primary mr-4" />
                      <div>
                        <p className="font-medium">{res.filename}</p>
                        <p className="text-xs text-muted-foreground">{new Date(res.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View JSON</Button>
                  </div>
                ))}
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
