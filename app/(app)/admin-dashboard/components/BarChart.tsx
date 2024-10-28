"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const data = [
    {
      "name": "Pronounciation",
     
      "Passed": 2500,
      "Failed": 2400
    },
    {
      "name": "Comprehension",
      
      "Passed": 1398,
      "Failed": 2210
    },
    {
      "name": "Fluency",
     
      "Passed": 7800,
      "Failed": 2290
    },
    {
      "name": "Diction",
     
      "Passed": 3908,
      "Failed": 2000
    },
    {
      "name": "Speed",
      
      "Passed": 4800,
      "Failed": 2181
    },
    {
      "name": "Grammar",
     
      "Passed": 3800,
      "Failed": 2500
    }
   
  ]
const BarChartComponent = () => {
    return (
      <Card>
        <ResponsiveContainer width="100%"  height= "100%">
        <BarChart width={300} height={600} data={data}>
            <YAxis/>
            <XAxis dataKey="name"/>
            <CartesianGrid strokeDasharray="5 5"/>
            <Tooltip/>
            <Legend/>
           
              <Bar 
            type="monotone"
            dataKey="Failed"
            stroke="#2563eb"
            fill="#e30b0b"
            />
             <Bar 
            type="monotone"
            dataKey="Passed"
            stroke="#2563eb"
            fill="
            #42f566
            "
            />
        </BarChart>
        </ResponsiveContainer>
        </Card>
    )
};

export default BarChartComponent;
