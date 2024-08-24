import React from 'react'
import useGoogleSheets from 'use-google-sheets';
import TestimonialSlider from './testimonialSlider.jsx'

function Google() {
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


      const reverseTestimonios = [...data[0]['data']]; // Crea una copia
      reverseTestimonios.reverse(); // Invierte el orden

     // console.log(reverseTestimonios.reverse());
  return (
    <>
    <TestimonialSlider testimonios = {reverseTestimonios} />
    </>
  )
}

export default Google
