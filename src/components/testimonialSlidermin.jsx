import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles.css';
import parse from 'html-react-parser';

const TestimonialSlider = (props) => {

  const testimonios = props.testimonios;
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true,
    swipeToSlide: true,
    margin:10,

  
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
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
    <div className="testimonial-slider min">






      <Slider {...settings}>
        {testimonios.map((testimonial, index) => (




          <div key={index} className="item min">

            <div className="container">
            <div className="row">
                <div className="col-2 d-flex justify-content-center align-items-center">
                <img src={testimonial.img_flag} alt="bandera pais" className="img" />
                </div>
                <div className="col-10" style={{ background: '#0073b2', minHeight: '188px' }}>

                <div className="body">
              <span>{parse(testimonial.util_evento)}</span>
            </div>
            <div className="firma">
              <p>{testimonial.nombre} {testimonial.apellido}</p>
              <p>{testimonial.cargo_empresa}, {testimonial.nombre_empresa} </p>

            </div>
                </div>
            </div>
            </div>

       
        
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
