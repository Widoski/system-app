'use strict';

module.exports = function(Pago) {
    Pago.observe('after save', (ctx, next) => {
        const Cuota = Pago.app.models.Cuota;

        if (ctx.isNewInstance) {
            if (ctx.instance.interes) {
                const diferencia = (ctx.instance.importe * Number(ctx.instance.interes)) / 100;

                Cuota.findById(ctx.instance.cuotaId)
                    .then(cuota => {
                        console.log('cuota', cuota, diferencia);

                        cuota.montoActualizado = cuota.montoTotal + diferencia;

                        cuota.save().then((x) => {
                            console.log('cuota 2', x);

                            next();
                        })
                    });
            } else {
                next();
            }
        } else {
            next();
        }
    });
};
