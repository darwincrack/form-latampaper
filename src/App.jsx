import { useState } from 'react'
import Form from './components/form.jsx'

function App() {
  return (
    <>

  <div className="container-fluid my-5">
    <div className="p-5  bg-body-tertiary rounded-3">
        <h1 className="text-center">Feedback form</h1>
        <Form />
    </div>
  </div>

    </>
  )
}

export default App
