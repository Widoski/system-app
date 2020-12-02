import Axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import conf from '../../conf';
import { useHistory } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Paginate from '../Paginate';
import SearchIcon from '@material-ui/icons/Search';
import AppContext from '../../appContext';
import {
    TableCell,
    Table,
    TableContainer,
    TableHead,
    Tooltip,
    TableBody,
    TableRow,
    Button,
    Box,
    Paper,
    TextField
} from '@material-ui/core';

const styles = {
    title: {
        fontWeight: "bold",
    },
}

export default function Clients() {
    const context = useContext(AppContext);

    const history = useHistory();

    const [clients, setClients] = useState([]);
    const [numberOfClients, setNumberOfClients] = useState(0);
    const [search, setSearch] = useState(null)
    const limit = 10;
    let offset = 0

    const fetchPage = (page) => {
        if (page === 1) {
            offset = 0;
        } else {
            offset = (page - 1) * limit;
        }
        Axios.get(`${conf.API_URL}/clientes?filter={"limit": ${limit}, "offset": ${offset}}`)
            .then(res => {
                setClients(res.data);
            })
            .catch(err => console.log(err));
    }

    const countClients = () => {
        Axios.get(`${conf.API_URL}/clientes/count`)
            .then(res => {
                setNumberOfClients(res.data.count);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchPage(1);
        countClients();
    }, [])

    const showClientRegister = (id) => {
        history.push(`/clients/registers/${id}`);
    }

    const onChangeHandler = (e) => {
        setSearch(e.target.value);
    }

    const searchClient = (e) => {
        e.preventDefault();

        Axios.get(`${conf.API_URL}/clientes`, {
            params: {
                filter: {
                    where: {
                        id: search
                    }
                }
            }
        })
            .then(res => {
                if (res.data.length === 0) {
                    context.handleSnackbarAlert('error', 'No se encontró el cliente');
                } else {
                    setClients(res.data);
                }
            })
            .catch(error => console.log(error));
    }

    return (
        <div>
            <Box display="flex" justifyContent="space-between">
                <h4>AGENDA DE CLIENTES</h4>
                <form onSubmit={searchClient}>
                    <TextField
                        label="Buscar por id"
                        onChange={onChangeHandler}
                        value={search}
                        required
                    />
                    <Button type="submit">
                        <SearchIcon color="primary" />
                    </Button>
                </form>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.title}>Nombre</TableCell>
                            <TableCell style={styles.title}>Direccion</TableCell>
                            <TableCell style={styles.title}>Localidad</TableCell>
                            <TableCell style={styles.title}>Contacto</TableCell>
                            <TableCell style={styles.title}>Id</TableCell>
                            <TableCell style={styles.title}>Registros</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            clients.map(c =>
                                <TableRow key={c.id}>
                                    <TableCell>{c.nombre}</TableCell>
                                    <TableCell>{c.direccion}</TableCell>
                                    <TableCell>{c.localidad}</TableCell>
                                    <TableCell>{c.telefono}</TableCell>
                                    <TableCell>{c.id}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Ver">
                                            <Button onClick={() => showClientRegister(c.id)} color="primary"> <VisibilityIcon /></Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
                <Paginate
                    total={numberOfClients}
                    limitPerPage={limit}
                    fetch={fetchPage}
                />
            </TableContainer>
        </div>
    )
}