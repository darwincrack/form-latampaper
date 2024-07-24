import React from 'react'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function titlePage(props) {
  return (
    <>
      <h1 className="text-center">{props.titulo}</h1>
    </>
  )
}

export default titlePage
