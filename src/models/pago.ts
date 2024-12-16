import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/db';

//Para pagos
//Abono
//fecha de pago
//monto de pago
//monto retenido
//boleta de pago (numero de deposito/ transferencia)

class Pago extends Model {}

Pago.init(
    {
        pago_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        factura_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        monto_retenido: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        boleta_pago: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Pago',
        tableName: 'pagos',
        timestamps: false,
    }
)

export default Pago;
