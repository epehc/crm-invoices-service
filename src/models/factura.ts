import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/db';

class Factura extends Model {}

//Estado anulada (de ser asi quitar de saldo pendiente)
//Cuanto se facturo por mes

Factura.init(
    {
        factura_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        cliente_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productos: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Factura',
        tableName: 'facturas',
        timestamps: false,
    }
)

export default Factura;