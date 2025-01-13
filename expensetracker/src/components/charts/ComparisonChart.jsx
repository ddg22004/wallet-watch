
import React, { useState,useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
const ComparisionChart = ({data}) => {
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
   
    
  return (
    <div style={{ height: `${height}px` }}>
        <ResponsiveBar
            data={data}
            keys={['spent', 'budget']}
            indexBy="category"
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: 'paired' }} 
            axisBottom={{
                tickRotation: 0,
                legend: 'Categories',
                legendPosition: 'middle',
                legendOffset: 40,
                truncateTickAt: 9,
                
            }}
            axisLeft={{
                legend: 'Amount',
                legendPosition: 'middle',
                legendOffset: -50,
              
            }}
            enableLabel={true}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
        />
    </div>
);
}

export default ComparisionChart