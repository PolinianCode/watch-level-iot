import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import '../styles/slider.styles.css'

function SliderComponent() {
    const [sliderValue, setSliderValue] = useState([20, 80]);


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
                defaultValue={[20, 80]}
                value={sliderValue}
                onChange={setSliderValue}
                className="slider"
                thumbClassName="thumb"
                trackClassName="track"
                renderThumb={renderThumb}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
            />
        </div>
    );
}

export default SliderComponent;