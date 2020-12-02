import React, { useContext, useState, useEffect } from 'react';
import GraphicLine from './GraphicLine';
import Bounce from 'react-reveal/Bounce';
import moment from 'moment';
import conf from '../../conf';
import Axios from 'axios';
import AppContext from '../../appContext';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
	Box,
	Button,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Tooltip
} from '@material-ui/core';

const useStyles = makeStyles({
	container: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	card: {
		width: 260,
		height: 140,
		paddingLeft: 30,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		margin: 10
	},
	graphicLine: {
		width: 650,
		maxHeight: 400,
		margin: 10
	},
	tableCell: {
		color: "white",
		fontWeight: "bold"
	}
})

export default function Dashboard() {
	const classes = useStyles();
	const context = useContext(AppContext);

	const [totalIncome, setTotalIncome] = useState(0);
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [incomeRegistersOfTheDay, setIncomeRegistersOfTheDay] = useState([]);
	const [egressRegistersOfTheDay, setEgressRegistersOfTheDay] = useState([]);

	const showRegister = (id) => {
		Axios.get(`${conf.API_URL}/registros/${id}`)
			.then(res => {
				context.handleOpenRegister(true, res.data);
			})
	}

	useEffect(() => {
		Axios.get(`${conf.API_URL}/registros`, {
			params: {
				filter: {
					where: {
						tipo: 0,
						fecha: {
							between: [new Date().setHours(0), new Date().setHours(23, 59)]
						}
					}
				}
			}
		})
			.then(res => {
				let income = 0;

				setIncomeRegistersOfTheDay(res.data);
				console.log(res.data)

				res.data.forEach(e => {
					income += Number(e.monto);
				})
				setTotalIncome(income);
			})
			.catch(err => console.log(err));

		Axios.get(`${conf.API_URL}/registros`, {
			params: {
				filter: {
					where: {
						tipo: 1,
						fecha: {
							between: [new Date().setHours(0), new Date().setHours(23, 59)]
						}
					}
				}
			}
		})
			.then(res => {
				let expenses = 0;

				setEgressRegistersOfTheDay(res.data);

				res.data.forEach(e => {
					expenses -= Number(e.monto);
				})
				setTotalExpenses(expenses);
			})
			.catch(err => console.log(err));
	}, [])

	return (
		<Bounce right cascade>
			<Box className={classes.container}>
				<Box display="flex" flexDirection="column" justifyContent="space-between">
					<Paper className={classes.card} elevation={3} style={{ background: "#1976d2", color: "white" }}>
						<Typography>Ingreso diario</Typography>
						<Typography variant="h5">{`$ ${totalIncome}`}</Typography>
						<Typography>al {moment(new Date()).format("ll")}</Typography>
					</Paper>
					<Paper className={classes.card} elevation={3} style={{ background: "#df0808", color: "white" }}>
						<Typography>Egreso diario</Typography>
						<Typography variant="h5">{`$ ${totalExpenses}`}</Typography>
						<Typography>al {moment(new Date()).format("ll")}</Typography>
					</Paper>
				</Box>
				<Paper className={classes.graphicLine} elevation={3}>
					<GraphicLine />
				</Paper>
				<Box display="flex" justifyContent="space-between" style={{ width: "100%", marginTop: 20 }}>
					<div style={{ width: "50%", margin: 5 }}>
						<div style={{ height: 25, backgroundColor: "#1976d2", margin: 10, borderRadius: 5 }}>
							<Typography variant="button" style={{ color: "white", fontWeight: "bold", fontSize: 16, display: "flex", justifyContent: "center" }}>ÚLTIMOS INGRESOS</Typography>
						</div>
						<TableContainer component={Paper} style={{ minHeight: 350 }}>
							<Table>
								<TableHead style={{ background: "#4e342e" }}>
									<TableRow>
										<TableCell className={classes.tableCell}>Cliente</TableCell>
										<TableCell className={classes.tableCell}>Fecha</TableCell>
										<TableCell className={classes.tableCell}>Precio</TableCell>
										<TableCell className={classes.tableCell}>Detalles</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{incomeRegistersOfTheDay.map(r =>
										<TableRow key={r.id}>
											<TableCell>{r.nombre}</TableCell>
											<TableCell>{moment(r.fecha).format("l")}</TableCell>
											<TableCell>${r.monto}</TableCell>
											<TableCell>
												<Tooltip title="Ver detalles">
													<Button onClick={() => showRegister(r.id)} color="primary">
														<VisibilityIcon />
													</Button>
												</Tooltip>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
					<div style={{ width: "50%", margin: 5 }}>
						<div style={{ height: 25, backgroundColor: "#df0808", margin: 10, borderRadius: 5 }}>
							<Typography variant="button" style={{ color: "white", fontWeight: "bold", fontSize: 16, display: "flex", justifyContent: "center" }}>ÚLTIMOS EGRESOS</Typography>
						</div>
						<TableContainer component={Paper} style={{ minHeight: 350 }}>
							<Table>
								<TableHead style={{ background: "#4e342e" }}>
									<TableRow>
										<TableCell className={classes.tableCell}>Proveedor</TableCell>
										<TableCell className={classes.tableCell}>Fecha</TableCell>
										<TableCell className={classes.tableCell}>Gasto</TableCell>
										<TableCell className={classes.tableCell}>Detalles</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{egressRegistersOfTheDay.map(r =>
										<TableRow key={r.id}>
											<TableCell>{r.nombre}</TableCell>
											<TableCell>{moment(r.fecha).format("l")}</TableCell>
											<TableCell>${r.monto}</TableCell>
											<TableCell>
												<Tooltip title="Ver detalles">
													<Button onClick={() => showRegister(r.id)} color="primary">
														<VisibilityIcon />
													</Button>
												</Tooltip>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</Box>
			</Box>
		</Bounce >
	)
}
