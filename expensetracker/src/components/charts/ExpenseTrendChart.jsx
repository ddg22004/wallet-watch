import React,{useState,useEffect} from 'react';
import { ResponsiveLine } from '@nivo/line';

const ExpenseTrendChart = ({ data }) => {
     const [height, setChartHeight] = useState(400); 
        
            useEffect(() => {
                const handleResize = () => {
                    if (window.innerWidth < 640) {
                        setChartHeight(200); 
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
            <ResponsiveLine
                data={[
                    {
                        id: 'Expenses',
                        data: data.map(item => ({ x: item.month, y: item.spent })),
                    },
                ]}
                margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0 }}
                axisBottom={{
                    tickRotation: -45,
                    legend: 'Month',
                    legendOffset: 46,
                    
                    legendPosition:'middle'
                }}
              areaBlendMode="darken"
                axisLeft={{
                    legend: 'Total Spent',
                    legendOffset: -50,
                    legendPosition:'middle',
                     
                   
                }}
                
                enablePoints={false}
                useMesh={true}
                colors={['#2196f3']} // Customize color for the line
            />
        </div>
    );
};

export default ExpenseTrendChart;
