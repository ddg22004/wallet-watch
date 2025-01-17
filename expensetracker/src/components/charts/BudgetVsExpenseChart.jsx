import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';

const BudgetVsExpensesChart = ({ data, val }) => {
    const [chartHeight, setChartHeight] = useState(400); 

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
        <div style={{ height: chartHeight }}>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 100 }}
                innerRadius={val}
                padAngle={0.7}
                cornerRadius={4}
                colors={{ scheme: 'paired' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['brighter', 0.9]] }}
                enableArcLinkLabels={false}
                arcLinkLabel={(d) => `${d.id}: ${d.value}`}
                arcLabel={(d) => `${d.id}: ${d.value}`}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
};

export default BudgetVsExpensesChart;
