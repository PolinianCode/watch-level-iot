
import React, { createContext, useState, useContext, useEffect } from 'react';


const SliderContext = createContext();


export const SliderProvider = ({ children }) => {
    const [sliderValue, setSliderValue] = useState([20, 80]);
    const [isSending, setIsSending] = useState(false);

    const sendSliderValuesToBackend = async () => {
        try {
            const response = await fetch('http://3.73.1.47:8000/level_limits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lowerLimit: sliderValue[0],
                    upperLimit: sliderValue[1],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send data to backend');
            }

            const data = await response.json();
            console.log('Backend response:', data);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    return (
        <SliderContext.Provider value={{ sliderValue, setSliderValue, sendSliderValuesToBackend, isSending }}>
            {children}
        </SliderContext.Provider>
    );
};

export const useSlider = () => useContext(SliderContext);
