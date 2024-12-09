import React, { useState, useEffect } from 'react';
import './styles/dashboard.css';
import Tank from './components/tank.component';
import ChartComponent from './components/chart.component';
import SliderComponent from './components/slider.component';
import { useSlider } from './contexts/slider.context'

function Dashboard() {
    const [percentage, setPercentage] = useState(0);
    const { sliderValue } = useSlider();

    useEffect(() => {
        const ws = new WebSocket('ws://192.168.31.64:8000/ws');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onclose = () => {
            console.log('Disconnected Websocket')
        }

        ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            
            let data = parseInt(event.data, 10);

            setPercentage(data)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }, []);

    return (
        <div className="dashboard">
            <div className="left-panel">
                <h1>{percentage}%</h1>
                <Tank 
                    percentage={percentage} 
                    lowerLimit={sliderValue[0]} 
                    upperLimit={sliderValue[1]}     
                />
            </div>
            <div className="right-panel">
                <ChartComponent />
                <SliderComponent />
            </div>
        </div>
    );
}

export default Dashboard;
