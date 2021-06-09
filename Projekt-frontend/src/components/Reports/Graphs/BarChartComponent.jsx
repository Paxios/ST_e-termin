import React, { useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BarChartComponent({ data, barNames, colors }) {

    useEffect(() => {
        console.log(data);
    }, [data])


    var colorIndex = 0;
    const bars = barNames.map((barName) => (
        <Bar 
            dataKey={barName} 
            fill="#82ca9d" 
            type="monotone"
            name={barName}
            animationEasing="ease-in-out"
            fill={colors[colorIndex++]}
        />
    ))

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" width={10}/>
                <YAxis />
                <Tooltip />
                {bars}

            </BarChart>
        </ResponsiveContainer>
    );
}

export default BarChartComponent;


