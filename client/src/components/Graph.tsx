import { useState, useEffect } from "react"
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export function Graph({responseTimes}: GraphProps) {
  
  let number = 0;
  let dataset = {
    labels: number++,
    datasets: responseTimes
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 500,
    }
    },
    plugins: {
      title: {
        display: true,
        text: 'Fetch Speeds',
      },
    },
  };


  useEffect(() => {
    console.log("response times: ", dataset)
  }, [responseTimes])


  return (
    <div className="graphContainer">
      <Bar options={options} data={{
          labels:[...Array(responseTimes.length + 1).keys()].slice(1),
          datasets: [
            {
              label: "Request",
              data: responseTimes,
              backgroundColor: "rgba(53, 162, 235,0.75)",
            },
          ],
        }}/>
    </div>
  )
}

interface GraphProps {
  responseTimes: any[];
}