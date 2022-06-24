import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, } from '@mui/material'; 
import { Chart } from "react-google-charts";
import { useEffect } from 'react';

export const TreasuryFunds = (props) => {
  
    const options = { 
    is3D: true,
    title: `Market Value of Treasury Assets: ${props.total}$`,
    sliceVisibilityThreshold: .0
  };

  return (
    <Card {...props}>
      <CardHeader title="Treasury Assets" />
      <Divider />
      <CardContent> 
          <Chart
            chartType="PieChart"
            data={props.data}
            options={options}
            width={"100%"}
            height={"500px"}
          />
       
      </CardContent>
    </Card>
  );
};
