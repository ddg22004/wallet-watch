import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF6384', '#36A2EB'];

const BudgetVsExpensesChart = ({ data, val }) => {
    const [chartHeight, setChartHeight] = useState(400);

    useEffect(() => {
        const handleResize = () => {
            setChartHeight(window.innerWidth < 640 ? 300 : 400);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  if (
        !Array.isArray(data) ||
        data.length === 0 ||
        data.some(item => typeof item.id === 'undefined' || typeof item.value !== 'number')
    ) {
        return <div>No valid data to display the chart.</div>;
    }

  
    const rechartsData = data.map(item => ({
        name: item.id,
        value: item.value
    }));

    return (
        <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={rechartsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={val ? 100 + val * 50 : 120} // You can adjust this logic as needed
                        innerRadius={val ? 60 : 0}
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {rechartsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BudgetVsExpensesChart;
