import React, { useEffect, useState, useContext } from 'react';
import conf from '../../conf';
import { useParams, useHistory } from 'react-router';
import Axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
import AppContext from '../../appContext';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function ProductID() {
    const classes = useStyles();
    const context = useContext(AppContext);

    const { id } = useParams();

    const history = useHistory();

    const [product, setProduct] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        rodado: 'a',
        color: 'a',
        stock: '1',
    });

    useEffect(() => {
        Axios.get(`${conf.API_URL}/products/${id}`)
            .then(res => {
                setProduct(res.data);
            })
    }, [id]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    };

    const updateProduct = () => {
        context.handleOpenLinear();
        Axios.put(`${conf.API_URL}/products/${id}`, product)
            .then(res => {
                history.push('/products');
                context.handleSnackbarAlert('success', 'Producto actualizado');
                context.handleCloseLinear();
            })
            .catch(res => {
                context.handleSnackbarAlert('error', 'No se pudo actualizar el producto');
                context.handleCloseLinear();
            });
    };

    return (
        <div>
            <h4>ACTUALIZAR PRODUCTO</h4>
            <Paper>
                <form className={classes.root}>
                    <TextField
                        onChange={handleChange}
                        value={product.nombre}
                        name="nombre"
                        label="Nombre"
                        variant="outlined"
                    />
                    <TextField
                        onChange={handleChange}
                        value={product.descripcion}
                        name="descripcion"
                        label="Descripcion"
                        variant="outlined"
                    />
                    <TextField
                        onChange={handleChange}
                        value={product.precio}
                        name="precio"
                        label="Precio"
                        variant="outlined"
                    />
                </form>
                <Button onClick={updateProduct} variant="contained" color="primary" style={{ margin: 10 }}>
                    Actualizar
                </Button>
            </Paper>
        </div>
    );
}