import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles.css';
import parse from 'html-react-parser';

const TestimonialSlider = (props) => {

  
  useEffect(function () {
    document.body.style.backgroundColor = '#2c299f';

    return () => {
      document.body.style.backgroundColor = '';
    };
  })


  const testimonios = props.testimonios;
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    swipeToSlide: true,
    margin:10,

  
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="testimonial-slider">
      <Slider {...settings}>
        {testimonios.map((testimonial, index) => (
          <div key={index} className="item">
            <img src={testimonial.img_flag} alt="bandera pais" className="img" />
            <div className="body">
              <span>{parse(testimonial.util_evento)}</span>
            </div>
            <div className="firma">
              <p>{testimonial.nombre} {testimonial.apellido}</p>
              <p>{testimonial.cargo_empresa}, {testimonial.nombre_empresa} </p>
              <p>{testimonial.pais}</p>
              <img src={testimonial.img_empresa} alt={testimonial.nombre_empresa} className="logotipos" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
