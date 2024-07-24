import { useState, useEffect } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { obtenerFechaHora } from '../utils';
import TitlePage from './titlePage.jsx';


function FormEs() {

    const [fechaHora, setFechaHora] = useState(obtenerFechaHora());
    const [validated, setValidated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
   
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        tipo_evento: '',
        nombre_empresa: '',
        cargo_empresa: '',
        util_evento: '',
        corta_frase: '',
        comentario_sugerencia: '',
        pais:'',
        fecha: '',
        lang: 'port'

      });

      useEffect(() => {
        setFechaHora(obtenerFechaHora());

      
        fetch(
          "https://valid.layercode.workers.dev/list/countries?format=select&flags=false&value=code"
        )
          .then((response) => response.json())
          .then((data) => {
            setCountries(data.countries);
            setSelectedCountry(data.userSelectValue);
          });
      }, []);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleSubmit = async(event) => {

        event.preventDefault();
        event.stopPropagation();
        

        const form = event.currentTarget;
        setValidated(true);
        if (form.checkValidity() !== false) {
            setIsLoading(true);

            const Sheet_Url="https://script.google.com/macros/s/AKfycbwHaL2zYrNJREOnlXJ-m59A02cW0TjkI2Nd1eWvAU-7LBPwoQUTJRtkklxvjm-7rZH7/exec"
            try {

                formData.pais = selectedCountry.label;
                formData.fecha = fechaHora;
                formData.lang = 'po';
                const response =  await fetch(Sheet_Url, {
                method: 'POST',
                body: new URLSearchParams(formData)
              });
              const result = await response.json();
              setIsLoading(false);

              if (result.result === 'success') {
                setSuccessMessage('Obrigado por seu comentário!');
                document.body.scrollIntoView({ behavior: 'smooth' });
                setFormData({  nombre: '',
                  apellido: '',
                  tipo_evento: '',
                  nombre_empresa: '',
                  cargo_empresa: '',
                  util_evento: '',
                  corta_frase: '',
                  comentario_sugerencia: '' });
              

              } else {
                setErrorMessage('There was an error sending your comment. Please try again.');
              }
            } catch (error) {
      

                setErrorMessage('There was an error sending your comment. Please try again.');

            }
            setIsLoading(false);
            setValidated(false);

        }
    };

  return (

    <div>
        <TitlePage titulo="formulário de comentários"/>
         {successMessage && <Alert variant="success">{successMessage}</Alert>}
         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="exampleForm.SelectCustom">
            <Form.Label><small className="text-danger">*</small>Selecione o evento</Form.Label>
            <Form.Select
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleChange}
                required>
                <option value="">selecione o evento</option>
                <option value="Latampaper México 2024">Latampaper México 2024</option>
                <option value="LatamCORR México 2024">LatamCORR México 2024</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.pais">
            <Form.Label><small className="text-danger">*</small>País</Form.Label>
            <Select
              options={countries}
              value={selectedCountry}
              onChange={(selectedOption) => setSelectedCountry(selectedOption)}
            />

        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.nombre">
            <Form.Label><small className="text-danger">*</small>Nome</Form.Label>
            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.nombre">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.nombre_empresa">
            <Form.Label>Empresa</Form.Label>
            <Form.Control type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Cargo</Form.Label>
            <Form.Control type="text" name="cargo_empresa" value={formData.cargo_empresa} onChange={handleChange} />
        </Form.Group>

        <p className="fs-2">Seus comentários</p>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Diga-nos brevemente por que o evento foi útil para você</Form.Label>
            <Form.Control  as="textarea"  name="util_evento" value={formData.util_evento} onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Você pode nos contar em uma frase curta sua experiência        </Form.Label>
            <Form.Control  as="textarea"  name="corta_frase" value={formData.corta_frase} onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Você tem algum comentário ou sugestão que gostaria de compartilhar conosco</Form.Label>
            <Form.Control  as="textarea"  name="comentario_sugerencia" value={formData.comentario_sugerencia} onChange={handleChange}/>
        </Form.Group>
        <p><small className="text-danger">(*)</small> Campos obrigatórios</p>
        <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
            </Button>
        </div>
        </Form>
    </div>
  );
}

export default FormEs;
