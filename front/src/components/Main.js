import React, { useState } from 'react';
import Fixdrawer from './Fixdrawer';
import Navbar from './Navbar';
import Routing from './Routing'
import { Switch, useHistory } from 'react-router-dom';
import AppContext, { defaultGlobalState } from '../appContext';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoginUser from '../components/LoginUser';
import moment from 'moment';
import '../../src/print.css'
import {
    Box,
    Container,
    Button,
    makeStyles,
    Snackbar,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    Table,
    Paper,
    TableContainer,
    Typography,
    Tooltip
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    button: {
        fontSize: "12px",
        marginTop: "5px",
        borderRadius: "50px",
        color: "white",
        fontWeight: "bold"
    },
    dialog: {
        width: 800,
    },
    tableCell: {
        fontWeight: "bold"
    }
}))

export default function Main() {
    const classes = useStyles();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);

    const [showRegister, setShowRegister] = useState({
        status: false,
        data: ""
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alert, setAlert] = useState({
        status: '',
        message: ''
    })

    const [openModal, setOpenModal] = useState({
        status: false,
        title: '',
        dataClient: {}
    })

    const [openDialog, setOpenDialog] = useState(false);
    const [notifications, setNotifications] = useState([])

    const handleSnackbarAlert = (status, message) => {
        setAlert({
            status,
            message
        });
        setOpenSnackbar(true);
    }

    const handleOpenRegister = (status, registerData) => {
        setShowRegister({
            ...showRegister,
            status,
            data: registerData
        })
    }

    const handleCloseRegister = () => {
        setShowRegister({
            ...showRegister,
            status: false,
        })
    }

    const handleOpenLinear = () => {
        setLoading(true);
    }

    const handleCloseLinear = () => {
        setLoading(false);
    }

    const handleLogin = () => {
        setLogin(true);
        setOpenSnackbar(true);
    }

    const handleLogout = () => {
        setLogin(false);
        history.push('/login');
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    };

    const handleOpenDialog = () => {
        setOpenDialog(true)
    };

    const handleNotification = (notifications) => {
        setNotifications(notifications)
    };

    const handleOpenModal = (status, title, dataClient) => {
        setOpenModal({
            ...openModal,
            status,
            title,
            dataClient
        })
    }

    const handleCloseModal = () => {
        setOpenModal({
            ...openModal,
            status: false,
        })
    }

    const Alert = (props) => {
        return (
            <MuiAlert elevation={6} variant="filled" {...props} />
        )
    };

    return (
        <div className={classes.root}>
            <AppContext.Provider value={{
                ...defaultGlobalState,
                ui: {
                    ...defaultGlobalState.ui,
                    loading
                },
                handleOpenLinear,
                handleCloseLinear,
                handleLogin,
                handleLogout,
                handleSnackbarAlert,
                handleCloseSnackbar,
                handleNotification,
                handleOpenRegister,
                handleOpenModal
            }}>
                {
                    <Switch>
                        {
                            //  login ? (
                            <>
                                <Navbar />
                                <Fixdrawer />
                                <div className={classes.content}>
                                    <div className={classes.toolbar}></div>
                                    <Routing />

                                </div>
                            </>
                            //) : <LoginUser />
                        }
                    </Switch>
                }
                {
                    alert.status === '' ? null : (
                        <>
                            {
                                alert.status === 'success' ? (
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={6000}
                                        onClose={handleCloseSnackbar}>
                                        <Alert
                                            onClose={handleCloseSnackbar}
                                            severity="success">
                                            {alert.message}
                                        </Alert>
                                    </Snackbar>
                                ) : alert.status === 'error' ? (
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={6000}
                                        onClose={handleCloseSnackbar}>
                                        <Alert
                                            onClose={handleCloseSnackbar}
                                            severity="error">
                                            {alert.message}
                                        </Alert>
                                    </Snackbar>
                                ) : alert.status === 'warning' ? (
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={6000}
                                        onClose={handleCloseSnackbar}>
                                        <Tooltip title="Click para ver">
                                            <Button
                                                onClick={handleOpenDialog}
                                                className={classes.button}>
                                                <Alert
                                                    onClose={handleCloseSnackbar}
                                                    severity="warning">

                                                    {alert.message}

                                                </Alert>
                                            </Button>
                                        </Tooltip>
                                    </Snackbar>
                                ) : alert.status === 'info' ? (
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={6000}
                                        onClose={handleCloseSnackbar}>
                                        <Alert
                                            onClose={handleCloseSnackbar}
                                            severity="info">
                                            <Box display="flex" flexDirection="column">
                                                <div>
                                                    {alert.message}
                                                </div>
                                            </Box>
                                        </Alert>
                                    </Snackbar>
                                ) : null
                            }
                        </>
                    )
                }
                <Dialog
                    open={openDialog}
                    keepMounted
                    onClose={handleCloseDialog}
                    fullWidth
                >
                    <DialogTitle>EVENTO(S) DEL DÍA</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {notifications.map(n =>
                                <React.Fragment key={n.id}>
                                    <h4>{n.nombre}</h4> <p>{n.descripcion}</p>
                                </React.Fragment>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={showRegister.status}
                    keepMounted
                    onClose={handleCloseRegister}
                    maxWidth={true}
                >
                    {
                        showRegister.data.tipo === 0 ? (
                            <>
                                <Container>
                                    <Box display="flex" justifyContent="center" fontWeight="bold">
                                        <DialogTitle>REGISTRO DE INGRESO</DialogTitle>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="button">
                                            Nombre: {showRegister.data.nombre}
                                            <br />
                                            Nº de cliente: {showRegister.data.idCliente}
                                            <br />
                                            Nº de registro: {showRegister.data.id}
                                        </Typography>
                                        <Box display="flex" justifyContent="right">
                                            <Typography variant="button">Fecha: {moment(showRegister.data.fecha).format('l')}</Typography>
                                        </Box>
                                    </Box>
                                </Container>
                                <DialogContent>
                                    <DialogContentText>
                                        <TableContainer className={classes.dialog}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className={classes.tableCell}>Cantidad</TableCell>
                                                        <TableCell className={classes.tableCell}>Producto</TableCell>
                                                        <TableCell className={classes.tableCell}>Precio unitario</TableCell>
                                                        <TableCell className={classes.tableCell}>Importe</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        showRegister.data.productos.map(p =>
                                                            <TableRow component={Paper} key={p.id}>
                                                                <TableCell>x {p.quantity}</TableCell>
                                                                <TableCell>{p.nombre}</TableCell>
                                                                <TableCell>${p.precio}</TableCell>
                                                                <TableCell>${p.precio * p.quantity}</TableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                    <TableRow style={{ borderTop: "2px solid black" }}>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell className={classes.tableCell}>TOTAL</TableCell>
                                                        <TableCell className={classes.tableCell}>${showRegister.data.monto}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Box display="flex" className="notPrint">
                                        <Button onClick={() => window.print()} variant="outlined" color="primary" style={{ marginRight: 5 }}>
                                            Imprimir
                                        </Button>
                                        <Button onClick={handleCloseRegister} variant="contained" color="primary">
                                            Ok
                                        </Button>
                                    </Box>
                                </DialogActions>
                            </>
                        ) : showRegister.data.tipo === 1 ? (
                            <>
                                <DialogContent className={classes.dialog}>
                                    <Container>
                                        <Box display="flex" justifyContent="center" fontWeight="bold">
                                            <DialogTitle>REGISTRO DE EGRESO</DialogTitle>
                                        </Box>
                                        <Typography variant="button">
                                            Descripción: {showRegister.data.nombre}
                                            <br />
                                            Nº de registro: {showRegister.data.id}
                                            <br />
                                            Fecha: {moment(showRegister.data.fecha).format('l')}
                                        </Typography>
                                    </Container>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseRegister} variant="contained" color="primary">
                                        Ok
                                    </Button>
                                </DialogActions>
                            </>
                        ) : null
                    }
                </Dialog>

                <Dialog
                    open={openModal.status}
                    keepMounted
                    onClose={handleCloseModal}
                    fullWidth
                >
                    <DialogTitle>{openModal.title}</DialogTitle>
                    <DialogContent>
                        {
                            openModal.title === "NUEVO CLIENTE" ? (
                                <DialogContentText>
                                    Nombre: {openModal.dataClient.nombre}
                                    <br />
                                    Dirección: {openModal.dataClient.direccion}
                                    <br />
                                    Localidad: {openModal.dataClient.localidad}
                                    <br />
                                    Teléfono: {openModal.dataClient.telefono}
                                </DialogContentText>
                            ) : openModal.title === "EGRESO REGISTRADO" ? (
                                <DialogContentText>
                                    Descripción: {openModal.dataClient.nombre}
                                    <br />
                                    Monto: {openModal.dataClient.monto}
                                </DialogContentText>
                            ) : null
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </AppContext.Provider>
        </div >
    );
}