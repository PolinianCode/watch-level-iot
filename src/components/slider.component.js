// SliderComponent.js
import React from 'react';
import { useEffect } from 'react';
import ReactSlider from 'react-slider';
import { useSlider } from '../contexts/slider.context'; 
import '../styles/slider.styles.css';

function SliderComponent() {
    const { sliderValue, setSliderValue, sendSliderValuesToBackend, isSending } = useSlider(); // Access the context


    useEffect(() => {
        const fetchLastLimits = async () => {
            try {
                const response = await fetch('http://3.73.1.47:8000/level_limits');
                if (!response.ok) {
                    throw new Error('Failed to fetch level limits');
                }
                const data = await response.json();
                setSliderValue([data.lowerLimit, data.upperLimit]);
            } catch (error) {
                console.error('Error fetching level limits:', error);
            }
        };

        fetchLastLimits(); 
    }, [setSliderValue]);

    const renderThumb = (props, state) => {
        const { index } = state;
        const thumbStyle = index === 0 ? 'thumb red' : 'thumb green';
        const percentage = `${state.valueNow}%`;
        return (
            <div {...props} className={thumbStyle}>
                <span className="thumb-label">{percentage}</span>
            </div>
        );
    };

    return (
        <div>
            <h1>Ustawienie progów</h1>
            <ReactSlider
                value={sliderValue}  
                onChange={setSliderValue}  
                className="slider"
                thumbClassName="thumb"
                trackClassName="track"
                renderThumb={renderThumb}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
            />
            <button 
                onClick={sendSliderValuesToBackend} 
                disabled={isSending}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isSending ? 'not-allowed' : 'pointer',
                }}
            >
                {isSending ? 'Sending...' : 'Save Limits'}
            </button>
        </div>
    );
}

export default SliderComponent;
