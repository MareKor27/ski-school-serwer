import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'audit_log' })
export class AuditLogModel extends Model<AuditLogModel> {
  @Column({ type: DataType.STRING })
  action: string;

  @Column({ type: DataType.STRING })
  method: string;

  @Column({ type: DataType.STRING })
  path: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  userId: any | null;

  @Column({ type: DataType.JSONB, allowNull: true })
  body: any;

  @Column({ type: DataType.JSONB, allowNull: true })
  response: any;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isError: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  message: string | null;

  @CreatedAt
  createdAt: Date;
}
