import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import conf from '../../conf';
import AppContext from '../../appContext';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TextField,
} from '@material-ui/core';

const styles = {
    title: {
        fontWeight: "bold"
    },
}

export default function Registers() {
    const context = useContext(AppContext);

    const [register, setRegister] = useState('');
    const [product, setProduct] = useState('');
    const [totalProducts, setTotalProducts] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [arrayWithProducts, setArrayWithProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [clientId, setClientId] = useState('');
    const [outcomeRegister, setOutcomeRegister] = useState({
        nombre: '',
        monto: '',
        fecha: new Date(),
        productos: [{}],
        tipo: 1,
        idCliente: 0
    })

    const handleChangeOutcomeRegister = (e) => {
        const { name, value } = e.target;

        setOutcomeRegister({
            ...outcomeRegister,
            [name]: value
        })
    }

    const handleChangeRegister = (e) => {
        setRegister(e.target.value);
    };

    const handleChangeProducts = (e) => {
        setProduct(e.target.value);
    };

    const handleChangeClients = (e) => {
        setSelectedClient(e.target.value);
    }

    useEffect(() => {
        Axios.get(`${conf.API_URL}/products`)
            .then(res => {
                setTotalProducts(res.data);
            })
        Axios.get(`${conf.API_URL}/clientes`)
            .then(res => {
                setClients(res.data);
            })
    }, [])

    const checkIfProductIsAdded = (id) => {
        let productIsAdded = false;

        arrayWithProducts.forEach(p => {
            if (p.id === id) {
                productIsAdded = true
            }
        })
        return productIsAdded;
    }

    const addingProduct = (id) => {
        if (checkIfProductIsAdded(id)) {
            context.handleSnackbarAlert('error', 'El producto ya ha sido agregado');
            return;
        } else {
            Axios.get(`${conf.API_URL}/products/${id}`)
                .then(res => {
                    const obj = {};
                    obj.quantity = 1;

                    const newObject = Object.assign(res.data, obj);

                    arrayWithProducts.push(newObject);

                    setTotalIncome(totalIncome + Number(newObject.precio));
                })
        }
    }

    const addQuantity = (price, id, p) => {
        arrayWithProducts.forEach(p => {
            if (p.id === id) {
                p.quantity = p.quantity + 1;
                setTotalIncome(totalIncome + price);
            }
        })
    }

    const substractQuantity = (price, id, p) => {
        arrayWithProducts.forEach(p => {
            if (p.id === id) {
                p.quantity = p.quantity - 1;
                if (p.quantity < 1) {
                    const newArrayWithProducts = arrayWithProducts.slice();

                    const index = newArrayWithProducts.indexOf(p);

                    newArrayWithProducts.splice(index, 1);

                    setArrayWithProducts(newArrayWithProducts)
                }
                setTotalIncome(totalIncome - price);
            }
        })
    }
    const gettingClientId = (id) => {
        setClientId(id);
    }

    const submitFormRegister = () => {
        context.handleOpenLinear();

        const registerData = {
            tipo: 0,
            monto: totalIncome,
            fecha: new Date(),
            nombre: selectedClient,
            productos: arrayWithProducts,
            idCliente: clientId
        }

        Axios.post(`${conf.API_URL}/registros`, registerData)
            .then(res => {
                context.handleOpenRegister(true, res.data);
                context.handleCloseLinear();
                context.handleSnackbarAlert('success', 'Registro dado de alta')
                cleanFormIncome();
            })
            .catch(res => {
                context.handleCloseLinear();
                context.handleSnackbarAlert('error', 'No se pudo dar de alta el registro');
            })
    }

    const cleanFormIncome = () => {
        setRegister(null);
        setTotalIncome(0);
        setProduct('');
        setClientId('');
        setSelectedClient('')
        setArrayWithProducts([]);
    }

    const onSubmitOutcomeRegister = (e) => {
        e.preventDefault();
        context.handleOpenLinear();

        Axios.post(`${conf.API_URL}/registros`, outcomeRegister)
            .then(res => {
                context.handleCloseLinear();
                context.handleSnackbarAlert('success', 'Egreso registrado');
                context.handleOpenModal(true, 'EGRESO REGISTRADO', res.data)
                cleanFormOutcome();
            })
            .catch(err => {
                context.handleSnackbarAlert('error', 'No se pudo registrar el egreso');
            })
    }

    const cleanFormOutcome = () => {
        setOutcomeRegister({
            ...outcomeRegister,
            nombre: '',
            monto: '',
            fecha: new Date(),
            tipo: 1,
            productos: [{}],
            idCliente: 0
        })
    }

    return (
        <div>
            <Box display="flex" justifyContent="center">
                <h4>NUEVO REGISTRO</h4>
            </Box>
            <FormControl fullWidth>
                <InputLabel id="demo-controlled-open-select-label">Tipo</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    value={register}
                    onChange={handleChangeRegister}
                    fullWidth
                >
                    <MenuItem value="" disabled>
                        <em>Seleccione tipo</em>
                    </MenuItem>
                    <MenuItem value={'Ingreso'}>Ingreso</MenuItem>
                    <MenuItem value={'Egreso'}>Egreso</MenuItem>
                </Select>
            </FormControl>

            {
                register === 'Ingreso' ? (
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id="demo-controlled-open-select">Producto</InputLabel>
                            <Select
                                labelId="demo-controlled-open-select"
                                id="demo-controlled-open"
                                value={product}
                                onChange={handleChangeProducts}
                                fullWidth
                            >
                                <MenuItem value="" disabled>
                                    <em>Seleccione producto</em>
                                </MenuItem>
                                {
                                    totalProducts.map(p => <MenuItem onClick={() => addingProduct
                                        (p.id)} value={p.id} key={p.id}>{p.nombre}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-controlled-open-selected">Cliente</InputLabel>
                            <Select
                                labelId="demo-controlled-open-selected"
                                id="demo-controlled-open-selected"
                                value={selectedClient}
                                onChange={handleChangeClients}
                                fullWidth
                            >
                                <MenuItem value="" disabled>
                                    <em>Seleccione cliente</em>
                                </MenuItem>
                                {
                                    clients.map(c => <MenuItem key={c.id} value={c.nombre} onClick={() => gettingClientId(c.id)}>{c.nombre}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={styles.title}>Producto seleccionado</TableCell>
                                    <TableCell style={styles.title}>Cantidad</TableCell>
                                    <TableCell style={styles.title}>Precio por unidad</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    arrayWithProducts.map(p =>
                                        <TableRow key={p.id}>
                                            <TableCell>{p.nombre}</TableCell>
                                            <TableCell>{p.quantity}
                                                <button onClick={() => addQuantity(Number(p.precio), p.id, p)}>+</button>
                                                <button onClick={() => substractQuantity(Number(p.precio), p.id, p)}>-</button>
                                            </TableCell>
                                            <TableCell>{Number(p.precio)}</TableCell>
                                        </TableRow>)
                                }
                            </TableBody>
                        </Table>
                        <Box display="flex" justifyContent="space-between" mt={5}>
                            <h4>
                                IMPORTE TOTAL: {`$${totalIncome}`}
                            </h4>
                            <Box>
                                <Button style={{ margin: 3 }} variant="contained" color="primary" onClick={() => submitFormRegister()}>Dar de alta</Button>
                                <Button variant="outlined" color="primary" onClick={() => cleanFormIncome()}>Limpiar registro</Button>
                            </Box>
                        </Box>
                    </div>
                ) : register === 'Egreso' ? (
                    <div >
                        <form onSubmit={onSubmitOutcomeRegister}>
                            <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "50%" }}>
                                <TextField
                                    name="nombre"
                                    onChange={handleChangeOutcomeRegister}
                                    value={outcomeRegister.nombre}
                                    variant="outlined"
                                    label="Descripción"
                                    fullWidth
                                    multiline
                                    rows={8}
                                    style={{ margin: 10 }}
                                    required
                                />
                                <TextField
                                    name="monto"
                                    onChange={handleChangeOutcomeRegister}
                                    value={outcomeRegister.monto}
                                    variant="outlined"
                                    label="Indicar egreso"
                                    type="number"
                                    fullWidth
                                    style={{ margin: 10 }}
                                    required
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ margin: 10 }}
                                >
                                    Registrar egreso
                                </Button>
                            </Box>
                        </form>
                    </div>
                ) : null
            }
        </div>
    )
}
