import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/db';

class Pago extends Model {
    public pago_id!: string;
    public factura_id!: number;
    public fecha!: string;
    public monto!: number;
    public boleta_pago!: string;
}

Pago.init(
    {
        pago_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        factura_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monto: {
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
