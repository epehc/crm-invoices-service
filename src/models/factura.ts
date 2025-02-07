import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/db';

class Factura extends Model {
    public factura_id!: number;
    public client_id!: string;
    public cliente_nombre!: string;
    public estado!: string;
    public fecha!: string;
    public fecha_vencimiento!: string;
    public total!: number;
    public iva!: number;
    public total_sin_iva!: number;
    public abonado!: number;
    public saldo_pendiente!: number;
    public nit!: string;
    public descripcion!: string;
}

Factura.init(
    {
        factura_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        cliente_nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_vencimiento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        iva: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total_sin_iva: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        abonado: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        saldo_pendiente: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true,
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