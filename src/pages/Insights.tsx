import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { InsightsMetricCard } from '@/components/InsightsMetricCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, Clock } from 'lucide-react';

export default function Insights() {
  const { currentUser, projects, getInsightsMetrics } = useApp();
  const [selectedProject, setSelectedProject] = useState<string>('all');

  if (!currentUser || currentUser.role !== 'admin') {
    return <Layout><div className="p-8">Access denied</div></Layout>;
  }

  const projectFilter = selectedProject === 'all' ? undefined : selectedProject;
  const metrics = getInsightsMetrics(projectFilter);

  const statusData = [
    { name: 'Not Started', value: metrics.statusCounts.not_started, color: 'hsl(var(--muted))' },
    { name: 'In Progress', value: metrics.statusCounts.in_progress, color: 'hsl(var(--secondary))' },
    { name: 'Completed', value: metrics.statusCounts.completed, color: 'hsl(var(--primary))' },
  ];

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Insights</h1>
            <p className="text-muted-foreground mt-1">Onboarding metrics and analytics</p>
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects
                .filter(p => p.workspaceId === currentUser.workspaceId)
                .map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InsightsMetricCard title="Avg. Completion Time" icon={Clock}>
            <div className="text-4xl font-bold">{metrics.avgCompletionDays}</div>
            <p className="text-sm text-muted-foreground mt-1">days to complete onboarding</p>
          </InsightsMetricCard>

          <InsightsMetricCard title="Assignments by Status" icon={Users}>
            <div className="h-[200px]">
              {statusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData.filter(d => d.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </InsightsMetricCard>

          <InsightsMetricCard title="Total Assignments" icon={TrendingUp}>
            <div className="text-4xl font-bold">
              {metrics.statusCounts.not_started + metrics.statusCounts.in_progress + metrics.statusCounts.completed}
            </div>
            <p className="text-sm text-muted-foreground mt-1">across all onboarding checklists</p>
          </InsightsMetricCard>
        </div>

        <InsightsMetricCard title="Assignments Created Over Time" description="Weekly trend of new assignments">
          <div className="h-[300px] mt-4">
            {metrics.assignmentsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.assignmentsOverTime}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value} assignments`, 'Count']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No assignment history yet
              </div>
            )}
          </div>
        </InsightsMetricCard>
      </div>
    </Layout>
  );
}
