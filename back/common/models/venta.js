'use strict';

module.exports = function(Venta) {
    Venta.observe('after save', (ctx, next) => {
        const Cuota = Venta.app.models.Cuota;
        const venta = ctx.instance;
        const date = new Date(venta.fecha);

        if (ctx.isNewInstance) {
            for (let i = 1; i <= venta.cuotas; i++) {
                const vencimiento = date.setMonth(date.getMonth() + 1);
                const ultimaIteracion = i === venta.cuotas;
    
                Cuota.create({
                    numeroCuota: i,
                    fechaVencimiento: vencimiento,
                    ventaId: ctx.instance.id
                })
                    .then(res => {   
                        if (ultimaIteracion) {
                            next()
                        }
                    })
                    .catch(err => {
                        console.log(err);
    
                        if (ultimaIteracion) {
                            next(err)
                        }
                    })
            }
        } else {
            next();
        }
    });

    Venta.observe('before save', (ctx, next) => {
        const Cuota = Venta.app.models.Cuota;

        if (!ctx.instance) {
            const ventaActual = ctx.data;
            const ventaPrevia = ctx.currentInstance;

            const montoCuota = ventaActual.total / ventaPrevia.cuotas;

            if (ventaPrevia.total !== ventaActual.total) {
                Cuota.find({
                    where: {
                        ventaId: ventaPrevia.id
                    }
                })
                    .then(cuotas => {
                        console.log('CUOTAS', cuotas);
                        cuotas.forEach((cuota, idx) => {
                            cuota.montoTotal = montoCuota;
                            cuota.save().then(res => {
                                if (idx === cuotas.length - 1) {
                                    next();
                                }
                            });
                        })

                    })
                    .catch(err => {
                        console.log(err);
                        next(err)
                    })
            }
        } else {
            next();
        }
    })
};
