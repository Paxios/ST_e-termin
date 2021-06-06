import React, { useEffect } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    BarChart,
    Bar,
} from "recharts";
import moment from "moment";

function LineChartComponent({ data, lineNames, colors }) {

    useEffect(() => {
        console.log(data);
    }, [data])


    var colorIndex = 0;
    const lines = lineNames.map((lineName) => (
        <Line
            type="monotone"
            name={lineName}
            key={lineName}
            dataKey={lineName}
            animationEasing="ease-in-out"
            stroke={colors[colorIndex]}
            strokeWidth={2}
            dot={{ stroke: colors[colorIndex++], strokeWidth: 2, r: 2 }}
            activeDot={{ r: 4 }}
        />
    ))

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    tickFormatter={(value) => {
                        return moment(value).format("D.MMM")
                    }}
                    dataKey="name"
                    tick={{
                        fontSize: "0.75rem",
                        fontFamily: "Roboto",
                        fill: "#a3a3a3",
                    }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis 
                    tickLine={false}
                    tick={{
                        fontSize: "0.75rem",
                        fontFamily: "Roboto",
                        fill: "#a3a3a3",
                    }}
                    axisLine={false}
                />
                <Tooltip />
                <Legend />
                {lines}

            </LineChart>
        </ResponsiveContainer>
    );
}

export default LineChartComponent;


