import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import conf from '../../conf';
import { useHistory } from 'react-router-dom';
import Paginate from '../Paginate';
import AppContext from '../../appContext';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Table,
    TextField,
    Button,
    Box,
    Paper,
    Tooltip,
} from '@material-ui/core';

const styles = {
    tableCell: {
        fontWeight: "bold"
    }
}

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [search, setSearch] = useState('');

    const limit = 10;
    let offset = 0;

    const history = useHistory();
    const context = useContext(AppContext);

    useEffect(() => {
        fetchProducts(1);
        countProducts();
    }, []);

    const fetchProducts = (page) => {
        if (page === 1) {
            offset = 0;
        } else {
            offset = (page - 1) * limit;
        }
        Axios.get(`${conf.API_URL}/products?filter={"limit": ${limit}, "offset": ${offset}}`)
            .then(res => {
                setProducts(res.data);
            })
            .catch(error => console.log(error))
    }

    const countProducts = () => {
        Axios.get(`${conf.API_URL}/products/count`)
            .then(res => {
                setTotalProducts(res.data.count);
            })
            .catch(err => console.log(err));
    }

    const handleEdit = (id) => {
        history.push(`/products/edit/${id}`);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        Axios.get(`${conf.API_URL}/products`, {
            params: {
                filter: {
                    where: {
                        nombre: search
                    }
                }
            }
        })
            .then(res => {
                const data = res.data;
                if (data.length === 0) {
                    context.handleSnackbarAlert('error', 'No se encontró el producto');
                } else {
                    setProducts(res.data);
                }
            })
            .catch(error => console.log(error));
    };

    const onChangeHandler = (e) => {
        setSearch(e.target.value);
    };

    const handleDelete = (id) => {
        Axios.delete(`${conf.API_URL}/products/${id}`)
            .then(res => {
                fetchProducts(1);
                context.handleSnackbarAlert('success', 'Producto eliminado');
            })
            .catch(err => context.handleSnackbarAlert('error', 'El producto no pudo ser eliminado'));
    };

    return (
        <div >
            <Box display="flex" justifyContent="space-between">
                <h4>LISTA DE PRODUCTOS</h4>
                <form onSubmit={onSubmit}>
                    <TextField
                        name='search'
                        variant="standard"
                        onChange={onChangeHandler}
                        value={search}
                        placeholder="Buscar por nombre"
                        required
                    />
                    <Button type='submit'>
                        <SearchIcon color="primary" />
                    </Button>
                </form>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.tableCell}>Nombre</TableCell>
                            <TableCell style={styles.tableCell}>Descripcion</TableCell>
                            <TableCell style={styles.tableCell}>Precio</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product =>
                            <TableRow key={product.id}>
                                <TableCell>{product.nombre}</TableCell>
                                <TableCell>{product.descripcion}</TableCell>
                                <TableCell>{product.precio}</TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <Button
                                            onClick={() => handleEdit(product.id)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Eliminar">
                                        <Button
                                            onClick={() => handleDelete(product.id)}
                                            color="primary"
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
                <Paginate
                    total={totalProducts}
                    limitPerPage={limit}
                    fetch={fetchProducts}
                />
            </TableContainer>
        </div>
    );
}