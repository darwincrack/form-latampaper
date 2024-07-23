import { useState } from 'react'
import Form from './components/form.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

  <div className="container my-5">
    <div className="p-5  bg-body-tertiary rounded-3">
        <h1 className="text-center">Feedback form</h1>
        <Form />
    </div>
  </div>

    </>
  )
}

export default App
