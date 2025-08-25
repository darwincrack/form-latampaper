import { useState, useEffect, useRef } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { obtenerFechaHora } from '../utils';
import TitlePage from './titlePage.jsx';
import { Editor } from '@tinymce/tinymce-react';

// Función para enviar datos usando formulario oculto (método simple sin CORS)
const submitToGoogleSheetsForm = (url, data) => {
    return new Promise((resolve) => {
        // Crear formulario oculto
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = 'hidden_iframe'; // Usar iframe oculto en lugar de nueva pestaña
        form.style.display = 'none';

        // Crear iframe oculto si no existe
        let iframe = document.getElementById('hidden_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hidden_iframe';
            iframe.name = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        // Agregar campos al formulario
        Object.keys(data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key] || '';
            form.appendChild(input);
        });

        // Agregar al DOM y enviar
        document.body.appendChild(form);
        form.submit();
        
        // Limpiar después de un momento
        setTimeout(() => {
            if (document.body.contains(form)) {
                document.body.removeChild(form);
            }
            resolve({ result: 'success' }); // Asumimos éxito
        }, 2000);
    });
};

// Función para enviar datos usando JSONP
const submitToGoogleSheetsJSONP = (url, data) => {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        
        // Crear script tag para JSONP
        const script = document.createElement('script');
        
        // Agregar callback global
        window[callbackName] = (response) => {
            delete window[callbackName];
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            resolve(response);
        };
        
        // Construir URL con parámetros y callback
        const params = new URLSearchParams(data);
        params.append('callback', callbackName);
        script.src = url + '?' + params.toString();
        
        // Manejar errores
        script.onerror = () => {
            delete window[callbackName];
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            reject(new Error('Error al conectar con Google Sheets'));
        };
        
        // Agregar script al DOM
        document.body.appendChild(script);
        
        // Timeout de 15 segundos (reducido)
        setTimeout(() => {
            if (window[callbackName]) {
                delete window[callbackName];
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
                reject(new Error('Timeout: La petición tardó demasiado'));
            }
        }, 15000);
    });
};

 


function FormEs() {
    const APIKEYGOOGLE =  'wl8sdletqhiq3mzm8bofwiui6wmnugk3xwwnqikk40j724e8';
    const [fechaHora, setFechaHora] = useState(obtenerFechaHora());
    const [validated, setValidated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
    const editorRef = useRef(null);
    const editorRef2 = useRef(null);
    const editorRef3 = useRef(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        tipo_evento: 'Latampaper Brasil 2025',
        nombre_empresa: '',
        cargo_empresa: '',
        util_evento: '',
        corta_frase: '',
        comentario_sugerencia: '',
        pais:'',
        fecha: '',
        img_flag:'',
        img_empresa: '',
        lang: 'es',
        tipo_usuario: 'supplier'

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

          if (editorRef.current) {
            console.log(editorRef.current.getContent());
          }
            setIsLoading(true);

            const Sheet_Url="https://script.google.com/macros/s/AKfycbwHaL2zYrNJREOnlXJ-m59A02cW0TjkI2Nd1eWvAU-7LBPwoQUTJRtkklxvjm-7rZH7/exec"
            try {
                // Preparar datos del formulario
                const dataToSend = {
                    ...formData,
                    pais: selectedCountry.label,
                    fecha: fechaHora,
                    lang: 'es',
                    util_evento: editorRef.current.getContent(),
                    corta_frase: editorRef2.current.getContent(),
                    comentario_sugerencia: editorRef3.current.getContent()
                };

                // Usar método de formulario (más confiable que JSONP)
                const result = await submitToGoogleSheetsForm(Sheet_Url, dataToSend);
                
                setIsLoading(false);

                if (result.result === 'success') {
                    setSuccessMessage('¡Gracias por tu comentario!');
                    setErrorMessage(''); // Limpiar mensaje de error anterior
                    document.body.scrollIntoView({ behavior: 'smooth' });
                    
                    // Limpiar formulario
                    setFormData({  
                        nombre: '',
                        apellido: '',
                        tipo_evento: 'Latampaper Brasil 2025',
                        nombre_empresa: '',
                        cargo_empresa: '',
                        util_evento: '',
                        corta_frase: '',
                        img_flag:'',
                        img_empresa:'',
                        comentario_sugerencia: '',
                        tipo_usuario:'supplier' 
                    });
                    
                    // Limpiar editores TinyMCE
                    if (editorRef.current) editorRef.current.setContent('');
                    if (editorRef2.current) editorRef2.current.setContent('');
                    if (editorRef3.current) editorRef3.current.setContent('');
                } else {
                    setErrorMessage('Hubo un error al enviar tu comentario. Por favor intenta de nuevo.');
                    setSuccessMessage(''); // Limpiar mensaje de éxito anterior
                }
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                setErrorMessage('Hubo un error al enviar tu comentario. Por favor intenta de nuevo.');
                setSuccessMessage(''); // Limpiar mensaje de éxito anterior
            }
            setIsLoading(false);
            setValidated(false);

        }
    };

  return (

    <div>

        <TitlePage titulo="Formulario de comentarios"/>
         {successMessage && <Alert variant="success">{successMessage}</Alert>}
         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>


        <Form.Group className="mb-3" controlId="exampleForm.tipo_usuario">
            <Form.Label>Tipo de usuario</Form.Label>
            <Form.Select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
            required>
                <option value="supplier">supplier (proveedor)</option>
                <option value="papermaker">papermaker (papelero)</option>
            </Form.Select>
        </Form.Group>


        <Form.Group className="mb-3" controlId="exampleForm.SelectCustom">
            <Form.Label><small className="text-danger">*</small>Seleccione el evento</Form.Label>
            <Form.Select
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleChange}
            required>
                <option value="Latampaper Brasil 2025">Latampaper Brasil 2025</option>
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
            <Form.Label><small className="text-danger">*</small>Nombre</Form.Label>
            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.nombre">
            <Form.Label>Apellido</Form.Label>
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

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>img_flag</Form.Label>
            <Form.Control type="text" name="img_flag" value={formData.img_flag} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>img_empresa</Form.Label>
            <Form.Control type="text" name="img_empresa" value={formData.img_empresa} onChange={handleChange} />
        </Form.Group>




        <p className="fs-2">Tus comentarios</p>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Díganos brevemente por que le resulto útil el evento</Form.Label>

            <Editor
              apiKey = {APIKEYGOOGLE}
              onInit={(_evt, editor) => editorRef.current = editor}
              init={
                {
                        height: 300,
                        menubar: true,
                        paste_as_text: true,
                      plugins: [
                          'paste', 'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }
                  }
      />
       
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Puede resumir su experiencia en una frase corta</Form.Label>
            <Editor
              apiKey= {APIKEYGOOGLE}
              onInit={(_evt, editor) => editorRef2.current = editor}
              init={
                {
                        height: 300,
                        menubar: true,
                        paste_as_text: true,
                      plugins: [
                        'paste', 'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }
                  }
      />        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>¿Tiene algún comentario o sugerencia que quiera compartir con nosotros?</Form.Label>
            <Editor
              apiKey= {APIKEYGOOGLE}
              onInit={(_evt, editor) => editorRef3.current = editor}
              init={
                {
                        height: 300,
                        menubar: true,
                        paste_as_text: true,
                      plugins: [
                          'paste', 'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }
                  }
      />        </Form.Group>
        <p><small className="text-danger">(*)</small> Campos requeridos</p>
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
