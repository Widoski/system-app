import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import conf from '../../conf';
import Axios from 'axios';

export default function GraphicSales() {
    useEffect(() => {
        Axios.get(`${conf.API_URL}/registros`, {
            params: {
                filter: {
                    where: {
                        tipo: 0,
                        fecha: {
                            between: [new Date().setMonth(0, [1]), new Date().setMonth(11, [31])]
                        }
                    }
                }
            }
        })
            .then(res => {
                const registers = res.data;
                let newMonths = { ...months }

                registers.forEach(register => {

                    const monthsOfRegisters = new Date(register.fecha).getMonth();

                    newMonths = {
                        ...months,
                        [monthsOfRegisters]: months[monthsOfRegisters] += register.monto
                    }
                })
                setMonths(newMonths);
            })
            .catch(err => console.log(err));
    }, [])

    const [months, setMonths] = useState({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0
    })

    const data = {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [
            {
                data: [
                    months[0], months[1], months[2], months[3], months[4], months[5], months[6], months[7], months[8], months[9], months[10], months[11], months[12]
                ],
                label: "Ingresos por mes",
                fill: false,
                borderColor: "#1976d2",
                pointBorderWidth: 3,
                pointHoverRadious: 10,
                pointHoverBackgroundColor: "black",
                pointRadious: 10,
                pointHitRadious: 10,
            }
        ]
    }

    return (
        <div>
            <Line
                data={data} />
        </div>
    )
}