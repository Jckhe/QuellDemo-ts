import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export function HitMiss({cacheMiss, cacheHit}: HitMissProps) {
    console.log('inside hitmiss component...cacheMiss = ', cacheMiss)
    console.log('inside hitmiss component....cacheHit= ', cacheHit)
     const data = {
      labels: ['Hit', 'Miss'],
      datasets: [
        {
          label: 'Hit or Miss',
          data: [cacheHit, cacheMiss], //should get these from state 
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  return <Doughnut data={data} />;
}

interface HitMissProps {
    cacheHit: number;
    cacheMiss: number;
  }