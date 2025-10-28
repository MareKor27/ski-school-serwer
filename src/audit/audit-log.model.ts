import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'audit_log' })
export class AuditLog extends Model<AuditLog> {
  @Column({ type: DataType.STRING })
  action: string;

  @Column({ type: DataType.STRING })
  method: string;

  @Column({ type: DataType.STRING })
  path: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @Column({ type: DataType.JSONB, allowNull: true })
  body: any;

  @Column({ type: DataType.JSONB, allowNull: true })
  response: any;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isError: boolean;

  @CreatedAt
  createdAt: Date;
}
