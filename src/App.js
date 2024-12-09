import React, { useState, useEffect } from 'react';
import './styles/dashboard.css';
import Tank from './components/tank.component';
import ChartComponent from './components/chart.component';
import SliderComponent from './components/slider.component';

function Dashboard() {
    const [percentage, setPercentage] = useState(0);
    const [socket, setSocket] = useState(null);

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
                <Tank percentage={percentage} />
            </div>
            <div className="right-panel">
                <ChartComponent />
                <SliderComponent />
            </div>
        </div>
    );
}

export default Dashboard;
