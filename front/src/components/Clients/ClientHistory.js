import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import conf from '../../conf';
import Axios from 'axios';
import moment from 'moment';
import Paginate from '../Paginate';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SearchIcon from '@material-ui/icons/Search';
import AppContext from '../../appContext';
import {
    TableCell,
    TableContainer,
    TableHead,
    Paper, Table,
    Tooltip,
    TableRow,
    TableBody,
    Button,
    TextField,
    Box
} from '@material-ui/core';


const styles = {
    tableCell: {
        fontWeight: "bold"
    },
}

export default function ClientHistory() {
    const { id } = useParams();
    const context = useContext(AppContext);

    const [clientRegisters, setClientRegisters] = useState([])
    const [numberOfRegisters, setNumberOfRegisters] = useState(0);
    const [client, setClient] = useState([]);
    const [search, setSearch] = useState('');

    const limit = 10;
    let offset = 0;

    const getClient = () => {
        Axios.get(`${conf.API_URL}/clientes/${id}`)
            .then(res => {
                setClient(res.data);
            })
    }

    const getRegistersCount = () => {
        Axios.get(`${conf.API_URL}/registros`, {
            params: {
                filter: {
                    where: {
                        idCliente: id
                    }
                }
            }
        })
            .then(res => {
                setNumberOfRegisters(res.data.length);
            })
    }

    const fetchPage = (page) => {

        if (page === 1) {
            offset = 0;
        } else {
            offset = (page - 1) * limit;
        }

        Axios.get(`${conf.API_URL}/registros`, {
            params: {
                filter: {
                    where: {
                        idCliente: id
                    },
                    limit: limit,
                    offset: offset
                }
            }
        })
            .then(res => {
                setClientRegisters(res.data);
            })
    }

    useEffect(() => {
        getClient();
        fetchPage(1);
        getRegistersCount();
    }, [])

    const showRegister = (id) => {
        Axios.get(`${conf.API_URL}/registros/${id}`)
            .then(res => {
                context.handleOpenRegister(true, res.data);
            })
            .catch(error => console.log(error));
    }

    const handleOnChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const onSubmitSearch = (e) => {
        e.preventDefault();

        Axios.get(`${conf.API_URL}/registros/`, {
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
                    context.handleSnackbarAlert('error', 'No se encontró al registro');
                } else {
                    setClientRegisters(res.data);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <Box display="flex" justifyContent="space-between">
                <h4>REGISTRO(S) | {client.nombre}</h4>
                <form onSubmit={onSubmitSearch}>
                    <TextField
                        onChange={handleOnChangeSearch}
                        value={search}
                        label="Buscar por id"
                        required
                    />
                    <Button type="submit">
                        <SearchIcon />
                    </Button>
                </form>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.tableCell}>Nº</TableCell>
                            <TableCell style={styles.tableCell}>Fecha</TableCell>
                            <TableCell style={styles.tableCell}>Detalles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            clientRegisters.map(r =>
                                <TableRow key={r.id}>
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell>{moment(r.fecha).format('l')}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Ver">
                                            <Button color="primary" onClick={() => showRegister(r.id)}><VisibilityIcon /></Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>)
                        }
                    </TableBody>
                </Table>
                <Paginate
                    total={numberOfRegisters}
                    limitPerPage={limit}
                    fetch={fetchPage}
                />
            </TableContainer>
        </div>
    )
};