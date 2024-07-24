import React from 'react'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function titlePage(props) {
  return (
    <>
      <h1 className="text-center">{props.titulo}</h1>
        <div className="text-center">
        Language:
          <Button href="/" className="m-2"  size="sm">English</Button>
          <Button href="/es" className="m-2"  size="sm"> Spanish</Button>
          <Button href="/port" className="m-2"  size="sm">Port</Button>
        </div>



    </>
  )
}

export default titlePage
