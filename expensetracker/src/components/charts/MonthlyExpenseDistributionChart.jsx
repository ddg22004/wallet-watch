import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useCategories } from '../context/CategoriesContext';
import { useEffect, useState } from 'react';

const MonthlyExpenseDistributionChart = ({ data }) => {
     const [height, setChartHeight] = useState(400); 
        
            useEffect(() => {
                const handleResize = () => {
                    if (window.innerWidth < 640) {
                        setChartHeight(300); 
                    } else {
                        setChartHeight(400); 
                    }
                };
        
                handleResize(); 
                window.addEventListener('resize', handleResize); 
        
                return () => {
                    window.removeEventListener('resize', handleResize); 
                };
            }, []);
       
    const {combinedCategories}=useCategories();
    return (
        <div style={{ height: `${height}px`}}>
            <ResponsiveBar
                data={data}
                keys={combinedCategories} 
                indexBy="month"
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'purple_blue' }}
                axisBottom={{
                    tickRotation: -45,
                    legend: 'Month',
                    legendPosition: 'middle',
                    legendOffset: 40,
                    tickTextColor: '#ffffff',
                }}
                axisLeft={{
                    legend: 'Amount',
                    legendPosition: 'middle',
                    legendOffset: -50,
                    tickTextColor: '#ffffff',
          
                }}
                
                enableLabel={true}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
            />
        </div>
    );
};

export default MonthlyExpenseDistributionChart;
