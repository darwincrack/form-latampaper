import React from 'react'
import useGoogleSheets from 'use-google-sheets';
import TestimonialSlider from './testimonialSlider.jsx'
import TestimonialSliderMin from './testimonialSlidermin.jsx'

import { useParams } from 'react-router-dom';


function Google({ componentType }) {
  const { eventId } = useParams();

    const { data, loading, error } = useGoogleSheets({
        apiKey: 'AIzaSyCjekNDQKCmqdqqaTxOInd3o_EzpcqzM8c',
        sheetId: '1DJpsEVT_A_H_LUCQoyQw1foWMSv4LhJ3tkqnlmBl89I',
      });

      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error!</div>;
      }

      // Mapeo de eventId a tipos de eventos
      const eventTypeMapping = {
        '1': 'Latampaper México 2024',
        '2': 'Latampaper Brasil 2025'
      };

      const reverseTestimonios = [...data[0]['data']]; // Crea una copia
      reverseTestimonios.reverse(); // Invierte el orden

      // Filtrar testimonios por tipo de evento si se proporciona un eventId
      let filteredTestimonios = reverseTestimonios;
      if (eventId && eventTypeMapping[eventId]) {
        const eventType = eventTypeMapping[eventId];
        filteredTestimonios = reverseTestimonios.filter(testimonio => 
          testimonio.tipo_evento === eventType
        );
      }

     // console.log(reverseTestimonios.reverse());
  return (
    <>
      {componentType === 'slidermin' ? <TestimonialSliderMin testimonios={filteredTestimonios} /> : <TestimonialSlider testimonios={filteredTestimonios} />}
    </>
  )
}

export default Google
