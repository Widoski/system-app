import Axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import conf from '../../conf';
import moment from 'moment';
import Paginate from '../Paginate';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AppContext from '../../appContext';
import {
    Table,
    TableBody,
    TableCell,
    Tooltip,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    TextField,
    Paper,
    Typography
} from '@material-ui/core';

const styles = {
    income: {
        width: 20,
        heigth: 20,
        border: "1px solid #c9e1f9",
        backgroundColor: "#c9e1f9",
        margin: 3
    },
    egress: {
        width: 20,
        heigth: 20,
        border: "1px solid #fdd5d5",
        background: "#fdd5d5",
        margin: 3
    },
    tableCell: {
        fontWeight: "bold"
    }
}

export default function RegistersList() {
    const context = useContext(AppContext);

    const [registers, setRegisters] = useState([]);
    const [numberOfRegisters, setNumberOfRegisters] = useState(0);
    const [search, setSearch] = useState('')

    let offset = 0;
    const limit = 10;

    useEffect(() => {
        fetchRegisters(1);
        registersCount();
    }, [])

    const fetchRegisters = (page) => {
        if (page === 1) {
            offset = 0;
        } else {
            offset = (page - 1) * limit;
        }
        Axios.get(`${conf.API_URL}/registros?filter={"limit": ${limit}, "offset": ${offset}}`)
            .then(res => setRegisters(res.data))
    }

    const registersCount = () => {
        Axios.get(`${conf.API_URL}/registros/count`)
            .then(res => setNumberOfRegisters(res.data.count))
    }

    const onChangeHandler = (e) => {
        setSearch(e.target.value)
        console.log(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        Axios.get(`${conf.API_URL}/registros`, {
            params: {
                filter: {
                    where: {
                        id: search
                    }
                }
            }
        })
            .then(res => {
                setRegisters(res.data)
            })
    }

    const showRegister = (id) => {
        Axios.get(`${conf.API_URL}/registros/${id}`)
            .then(res => {
                context.handleOpenRegister(true, res.data);
            })
            .catch(res => {
                context.handleSnackbarAlert('error', 'No se puede mostrar el registro');
            })
    }

    return (
        <div>
            <Box display="flex" justifyContent="space-between">
                <div>
                    <h4>HISTORIAL DE REGISTROS</h4>
                    <Typography variant="button">
                        <Box display="flex">
                            Ingresos <div style={styles.income}></div>
                            Egresos <div style={styles.egress}></div>
                        </Box>
                    </Typography>
                </div>
                <form onSubmit={onSubmit}>
                    <TextField
                        name='search'
                        variant="standard"
                        onChange={onChangeHandler}
                        value={search}
                        placeholder="Buscar registro por Nº"
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
                            <TableCell style={styles.tableCell}>Cliente</TableCell>
                            <TableCell style={styles.tableCell}>Fecha</TableCell>
                            <TableCell style={styles.tableCell}>Nº</TableCell>
                            <TableCell style={styles.tableCell}>Detalles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            registers.map(r =>
                                r.tipo === 0 ? (
                                    <TableRow key={r.id} style={{ background: "#c9e1f9" }}>
                                        <TableCell>{r.nombre}</TableCell>
                                        <TableCell>{moment(r.fecha).format('l')}</TableCell>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Ver">
                                                <Button onClick={() => showRegister(r.id)} color="primary">
                                                    <VisibilityIcon />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ) : r.tipo === 1 ? (
                                    <TableRow key={r.id} style={{ background: "#fdd5d5" }}>
                                        <TableCell>{r.nombre}</TableCell>
                                        <TableCell>{moment(r.fecha).format('l')}</TableCell>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Ver">
                                                <Button onClick={() => showRegister(r.id)} color="primary">
                                                    <VisibilityIcon />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ) : null
                            )
                        }
                    </TableBody>
                    <Paginate
                        total={numberOfRegisters}
                        limitPerPage={limit}
                        fetch={fetchRegisters}
                    />
                </Table>
            </TableContainer>
        </div>
    )
}