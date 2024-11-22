"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';

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
    { month: "Sep '24", meetings: 13, event: "Reduced Hours Ended" },
    { month: "Oct '24", meetings: 39, event: "Returned Full Time" }
  ];

  // Calculate advanced metrics
  const calculateMetrics = () => {
    const startIndex = data.findIndex(item => item.month === "Oct '23");
    const beforeJoining = data.slice(0, startIndex);
    const afterJoining = data.slice(startIndex);
    
    const beforeTotal = beforeJoining.reduce((sum, item) => sum + item.meetings, 0);
    const afterTotal = afterJoining.reduce((sum, item) => sum + item.meetings, 0);
    const beforeAvg = beforeTotal / beforeJoining.length;
    const afterAvg = afterTotal / afterJoining.length;
    
    // Calculate peak performance metrics
    const peakValue = Math.max(...data.map(item => item.meetings));
    const annualizedPeak = peakValue * 12;
    
    // Calculate growth streak
    let maxStreak = 0;
    let currentStreak = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i].meetings > data[i-1].meetings) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Calculate recovery rate
    const reducedHoursIndex = data.findIndex(item => item.month === "Aug '24");
    const recoveryRate = ((data[data.length-1].meetings - data[reducedHoursIndex].meetings) / data[reducedHoursIndex].meetings * 100).toFixed(0);
    
    return {
      beforeTotal,
      afterTotal,
      beforeAvg: beforeAvg.toFixed(1),
      afterAvg: afterAvg.toFixed(1),
      improvementPercent: (((afterAvg - beforeAvg) / beforeAvg) * 100).toFixed(0),
      annualizedPeak,
      maxStreak,
      recoveryRate
    };
  };

  const metrics = calculateMetrics();

  // Enhanced period comparison data
  const periodComparison = [
    {
      period: "Pre-joining Average (Monthly)",
      meetings: parseFloat(metrics.beforeAvg)
    },
    {
      period: "Peak Performance",
      meetings: 41
    },
    {
      period: "Post-Recovery",
      meetings: 39
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = data.find(d => d.month === label);
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold text-blue-600">{label}</p>
          <p className="text-blue-600">{`Meetings Secured: ${payload[0].value}`}</p>
          {dataPoint?.event && (
            <p className="text-blue-600">{`Event: ${dataPoint.event}`}</p>
          )}
          {payload[0].value > 0 && metrics.beforeAvg && (
            <p className="text-green-600">
              {`${((payload[0].value - metrics.beforeAvg) / metrics.beforeAvg * 100).toFixed(0)}% vs. Baseline`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-4 bg-gradient-to-br from-white to-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{metrics.afterTotal}</p>
            <p className="text-sm text-blue-600">Meetings Secured After Joining</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Performance Increase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">+{metrics.improvementPercent}%</p>
            <p className="text-sm text-blue-600">vs. Previous Average</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Peak Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">41</p>
            <p className="text-sm text-blue-600">Meetings in One Month</p>
            <p className="text-xs text-green-600">{metrics.annualizedPeak} Annualized</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Post-Reduction Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">+{metrics.recoveryRate}%</p>
            <p className="text-sm text-blue-600">Recovery Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Monthly Meetings Secured Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <defs>
                  <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[0, 45]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="meetings" fill="url(#colorMeetings)" stroke="none" />
                <Line type="monotone" dataKey="meetings" name="Meetings Secured" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <ReferenceLine 
                  x="Oct '23" 
                  stroke="#22c55e" 
                  label={{ 
                    value: "Started Role", 
                    fill: "#2563eb", 
                    position: "top",
                    offset: 20
                  }} 
                />
                <ReferenceLine 
                  x="Aug '24" 
                  stroke="#ef4444" 
                  label={{ 
                    value: "Reduced Hours", 
                    fill: "#2563eb", 
                    position: "insideBottom",
                    offset: 20
                  }} 
                />
                <ReferenceLine 
                  x="Sep '24" 
                  stroke="#ef4444" 
                  label={{ 
                    value: "Reduced Hours Ended", 
                    fill: "#2563eb", 
                    position: "top",
                    offset: 20
                  }} 
                />
                <ReferenceLine 
                  x="Oct '24" 
                  stroke="#2563eb" 
                  label={{ 
                    value: "Full Time", 
                    fill: "#2563eb", 
                    position: "insideBottom",
                    offset: 20
                  }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="meetings" name="Meetings Secured" fill="#2563eb">
                  {periodComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#22c55e' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BDMetricsDashboard;
