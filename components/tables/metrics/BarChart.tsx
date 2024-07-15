// // components/BarChart.tsx

// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// interface BarChartProps {
//   data: {
//     labels: string[];
//     datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number }[];
//   };
// }

// const BarChart: React.FC<BarChartProps> = ({ data }) => {
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       title: {
//         display: true,
//         text: 'Number of Calls',
//       },
//     },
//   };

//   return <div className="w-full h-96"><Bar data={data} options={options} /></div>;
// };

// export default BarChart;


// components/BarChart.tsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number }[];
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily API Key Usage',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <div className="w-full h-96"><Bar data={data} options={options} /></div>;
};

export default BarChart;
