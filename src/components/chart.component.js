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
      const url = `https://your-server.com/api/data?start=${startDate}&end=${endDate}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        setChartData({
          labels: data.map(d => d.label),
          datasets: [
            {
              ...chartData.datasets[0],
              data: data.map(d => d.value)
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
