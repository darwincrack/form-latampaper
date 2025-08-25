import { Routes, Route } from "react-router-dom"

import Form from './components/form.jsx'
import FormEs from './components/formEs.jsx'
import FormPort from './components/formPort.jsx'
import Google from './components/google.jsx'
function App() {
  return (
    <>

<div className="container-fluid">
    <div className="bg-body-tertiary rounded-3">
          <Routes>
            <Route path="/" element={ <Form /> } />
            <Route path="es" element={ <FormEs /> } />
            <Route path="port" element={ <FormPort /> } />

            <Route path="/testimonios/:eventId?" element={<Google componentType="slider" />} />
            <Route path="/testimonios-min/:eventId?" element={<Google componentType="slidermin" />} />

          </Routes>
    </div>
  </div>
 
    </>
  )
}

export default App
