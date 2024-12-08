import React from 'react';
import './styles/dashboard.css'; 
import Tank from "./components/tank.component"
import ChartComponent from './components/chart.component'; 
import SliderComponent from './components/slider.component'; 

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="left-panel">
                <Tank percentage={80}/>
            </div>
            <div className="right-panel">
                <ChartComponent />
                <SliderComponent />
            </div>
        </div>
    );
}

export default Dashboard;
