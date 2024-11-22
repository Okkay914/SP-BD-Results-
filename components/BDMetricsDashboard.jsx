import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const BDMetricsDashboard = () => {
  const data = [
    { month: "Dec '22", meetings: 3 },
    { month: "Jan '23", meetings: 3 },
    { month: "Feb '23", meetings: 4 },
    { month: "Mar '23", meetings: 6 },
    { month: "Apr '23", meetings: 10 },
    { month: "May '23", meetings: 9 },
    { month: "Jun '23", meetings: 9 },
    { month: "Aug '23", meetings: 9 },
    { month: "Sep '23", meetings: 7 },
    { month: "Oct '23", meetings: 16, event: "Started Role" },
    { month: "Dec '23", meetings: 14 },
    { month: "Jan '24", meetings: 19 },
    { month: "Feb '24", meetings: 22 },
    { month: "Mar '24", meetings: 22 },
    { month: "Apr '24", meetings: 41 },
    { month: "May '24", meetings: 20 },
    { month: "Jun '24", meetings: 21 },
    { month: "Aug '24", meetings: 10, event: "Reduced Hours" },
    { month: "Sep '24", meetings: 13 },
    { month: "Oct '24", meetings: 39, event: "Full Time" }
  ];

  const calculateMetrics = () => {
    const total = data.reduce((sum, item) => sum + item.meetings, 0);
    const avg = total / data.length;
    const max = Math.max(...data.map(item => item.meetings));
    const min = Math.min(...data.map(item => item.meetings));
    
    return {
      total,
      avg: avg.toFixed(1),
      max,
      min
    };
  };

  const metrics = calculateMetrics();

  const quarterlyData = data.reduce((acc, curr) => {
    const year = curr.month.split(" ")[1];
    const month = curr.month.split(" ")[0];
    const quarterMap = {
      'Jan': 'Q1', 'Feb': 'Q1', 'Mar': 'Q1',
      'Apr': 'Q2', 'May': 'Q2', 'Jun': 'Q2',
      'Jul': 'Q3', 'Aug': 'Q3', 'Sep': 'Q3',
      'Oct': 'Q4', 'Nov': 'Q4', 'Dec': 'Q4'
    };
    const quarter = `${quarterMap[month]} ${year}`;
    
    if (!acc[quarter]) {
      acc[quarter] = { sum: 0, count: 0 };
    }
    acc[quarter].sum += curr.meetings;
    acc[quarter].count += 1;
    return acc;
  }, {});

  const quarterlyAverages = Object.entries(quarterlyData).map(([quarter, data]) => ({
    quarter,
    average: Math.round(data.sum / data.count)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = data.find(d => d.month === label);
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          <p className="text-blue-600">{`Meetings: ${payload[0].value}`}</p>
          {dataPoint?.event && (
            <p className="text-gray-600">{`Event: ${dataPoint.event}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{metrics.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{metrics.avg}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{metrics.max}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minimum Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{metrics.min}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Meeting Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="meetings" stroke="#2563eb" strokeWidth={2} />
                <ReferenceLine x="Oct '23" stroke="#22c55e" label="Started Role" />
                <ReferenceLine x="Aug '24" stroke="#ef4444" label="Reduced Hours" />
                <ReferenceLine x="Oct '24" stroke="#22c55e" label="Full Time" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quarterly Averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BDMetricsDashboard;
