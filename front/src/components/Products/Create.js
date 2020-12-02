import React, { useState, useContext } from 'react';
import Axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import conf from '../../conf';
import AppContext from '../../appContext';

const styles = {
    textMargin: {
        margin: 10
    }
};

export default function CreateProduct() {
    const context = useContext(AppContext);

    const [product, setProduct] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        rodado: 'a',
        color: 'a',
        stock: '1',
    });

    const handleChange = (evt) => {
        setProduct(
            {
                ...product,
                [evt.target.name]: evt.target.value
            }
        )
    };

    const handleClickUpLoad = () => {
        context.handleOpenLinear();
        Axios.post(`${conf.API_URL}/products`, product)
            .then(res => {
                setProduct({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    rodado: 'a',
                    color: 'a',
                    stock: '1',
                });
                context.handleCloseLinear();
                context.handleSnackbarAlert('success', 'Producto creado');
            })
            .catch(err => {
                context.handleCloseLinear();
                context.handleSnackbarAlert('error', 'No se pudo crear el producto');
            });
    };

    return (
        <div>
            <h4 style={styles.textInputMargin}>NUEVO PRODUCTO</h4>
            <form>
                <TextField
                    style={styles.textMargin}
                    value={product.nombre}
                    onChange={handleChange}
                    name="nombre"
                    label="Nombre"
                    variant="outlined"
                    required
                />
                <TextField
                    style={styles.textMargin}
                    value={product.descripcion}
                    onChange={handleChange}
                    name="descripcion"
                    label="Descripción"
                    variant="outlined"
                    required
                />
                <TextField
                    style={styles.textMargin}
                    value={product.precio}
                    onChange={handleChange}
                    type="number"
                    name="precio"
                    label="Precio"
                    variant="outlined"
                    required
                />
            </form>
            <Button
                onClick={handleClickUpLoad}
                variant="contained"
                color="primary"
                style={styles.textMargin}
            >
                Crear
                </Button>
        </div>

    );
}