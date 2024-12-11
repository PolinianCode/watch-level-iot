import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const HistoricalDataChart = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Dane historyczne',
        data: [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      }
    ]
  });

  const fetchData = async () => {
    if (startDate && endDate) {
      const response = await fetch('http://3.73.1.47:8000/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to send data to backend');
    }

    const data = await response.json();
    console.log('Backend response:', data);

    const labels = data.data.map(item => item.timestamp);  
    const values = data.data.map(item => item.value);      


    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Dane historyczne',
          data: values,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        }
      ]
    });
      
    } else {
      console.log("Please select both start and end dates.");
    }

  };

  return (
    <div>
      <div>
        <label>Od: </label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <label>Do: </label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <button onClick={fetchData}>Ok</button>
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default HistoricalDataChart;
