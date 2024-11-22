"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
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
   { month: "Sep '24", meetings: 13, event: "Reduced Hours Ended" },
   { month: "Oct '24", meetings: 39, event: "Returned Full Time" }
 ];

 const calculateMetrics = () => {
   const startIndex = data.findIndex(item => item.month === "Oct '23");
   const beforeJoining = data.slice(0, startIndex);
   const afterJoining = data.slice(startIndex);
   
   const beforeTotal = beforeJoining.reduce((sum, item) => sum + item.meetings, 0);
   const afterTotal = afterJoining.reduce((sum, item) => sum + item.meetings, 0);
   const beforeAvg = beforeTotal / beforeJoining.length;
   const afterAvg = afterTotal / afterJoining.length;
   
   return {
     beforeTotal,
     afterTotal,
     beforeAvg: beforeAvg.toFixed(1),
     afterAvg: afterAvg.toFixed(1),
     improvementPercent: (((afterAvg - beforeAvg) / beforeAvg) * 100).toFixed(0)
   };
 };

 const metrics = calculateMetrics();

 const periodComparison = [
   {
     period: "Before Oct '23",
     meetings: metrics.beforeTotal
   },
   {
     period: "After Oct '23",
     meetings: metrics.afterTotal
   }
 ];

 const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
     const dataPoint = data.find(d => d.month === label);
     return (
       <div className="bg-white p-4 border rounded shadow">
         <p className="font-bold">{label}</p>
         <p className="text-blue-600">{`Meetings Secured: ${payload[0].value}`}</p>
         {dataPoint?.event && (
           <p className="text-blue-600">{`Event: ${dataPoint.event}`}</p>
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
           <CardTitle className="text-lg">Meetings Secured Before Joining</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-3xl font-bold text-blue-600">{metrics.beforeTotal}</p>
           <p className="text-sm text-blue-600">Avg: {metrics.beforeAvg}/month</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader>
           <CardTitle className="text-lg">Meetings Secured After Joining</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-3xl font-bold text-blue-600">{metrics.afterTotal}</p>
           <p className="text-sm text-blue-600">Avg: {metrics.afterAvg}/month</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader>
           <CardTitle className="text-lg">Performance Increase</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-3xl font-bold text-green-600">+{metrics.improvementPercent}%</p>
           <p className="text-sm text-blue-600">Monthly Average</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader>
           <CardTitle className="text-lg">Peak Performance</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-3xl font-bold text-blue-600">41</p>
           <p className="text-sm text-blue-600">April 2024</p>
         </CardContent>
       </Card>
     </div>

     <Card>
       <CardHeader>
         <CardTitle>Monthly Meetings Secured Trends</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="h-96">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
               <YAxis domain={[0, 45]} />
               <Tooltip content={<CustomTooltip />} />
               <Legend />
               <Line type="monotone" dataKey="meetings" name="Meetings Secured" stroke="#2563eb" strokeWidth={2} />
               <ReferenceLine 
                 x="Oct '23" 
                 stroke="#2563eb" 
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
             </LineChart>
           </ResponsiveContainer>
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle>Total Meetings Secured Comparison</CardTitle>
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
               <Bar dataKey="meetings" name="Meetings Secured" fill="#2563eb" />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </CardContent>
     </Card>
   </div>
 );
};

export default BDMetricsDashboard;
