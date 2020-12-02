import { TextField, Box, Button } from '@material-ui/core';
import Axios from 'axios';
import React, { useState, useContext } from 'react';
import conf from '../../conf';
import AppContext from '../../appContext';

export default function NewClient() {

    const context = useContext(AppContext);

    const [newClient, setNewClient] = useState({
        codigo: "string",
        nombre: "",
        apellido: "",
        documentoTipo: "string",
        documento: 0,
        telefono: "",
        direccion: "",
        localidad: "",
        categoriaCliente: "string",
        observaciones: "string",
        debe: 0,
        haber: 0,
    })

    const onChangeHandler = (e) => {
        const { name, value } = e.target;

        setNewClient({
            ...newClient,
            [name]: value
        })
    }

    const saveClient = (e) => {
        e.preventDefault();
        context.handleOpenLinear();

        Axios.post(`${conf.API_URL}/clientes`, newClient)
            .then(res => {
                context.handleCloseLinear();
                context.handleSnackbarAlert('success', 'Cliente agendado');
                context.handleOpenModal(true, 'NUEVO CLIENTE', res.data);

                setNewClient({
                    ...newClient,
                    codigo: "string",
                    nombre: "",
                    apellido: "",
                    documentoTipo: "string",
                    documento: 0,
                    telefono: "",
                    direccion: "",
                    localidad: "",
                    categoriaCliente: "string",
                    observaciones: "string",
                    debe: 0,
                    haber: 0,
                })
            })
            .catch(res => {
                context.handleSnackbarAlert('error', 'No se pudo agendar al cliente');
                context.handleCloseLinear();
            })
    }

    return (
        <div>
            <h4>CREAR NUEVO CLIENTE</h4>
            <Box display="flex" width="50%">
                <form onSubmit={saveClient}>
                    <Box display="flex">
                        <TextField
                            name="nombre"
                            variant="outlined"
                            label="Nombre"
                            onChange={onChangeHandler}
                            value={newClient.nombre}
                            required
                            style={{ margin: 10 }}
                        />

                        <TextField
                            name="telefono"
                            variant="outlined"
                            label="Teléfono"
                            onChange={onChangeHandler}
                            value={newClient.telefono}
                            required
                            style={{ margin: 10 }}
                        />
                    </Box>
                    <Box display="flex">
                        <TextField
                            name="direccion"
                            variant="outlined"
                            label="Dirección"
                            onChange={onChangeHandler}
                            value={newClient.direccion}
                            required
                            style={{ margin: 10 }}
                        />
                        <TextField
                            name="localidad"
                            variant="outlined"
                            label="Localidad"
                            onChange={onChangeHandler}
                            value={newClient.localidad}
                            required
                            style={{ margin: 10 }}
                        />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Guardar contacto
                    </Button>
                </form>
            </Box>
        </div >
    )
}