import {Table, Column, Model, IsUUID, PrimaryKey, DataType, NotNull, CreatedAt, AllowNull, AutoIncrement, ForeignKey, BelongsTo, Index} from 'sequelize-typescript';

@Table
export class OidcAccessToken extends Model<OidcAccessToken> {
    @PrimaryKey
    @Column
    id: string;

    @Index
    @Column
    grantId: string;

    @Column(DataType.JSON)
    data: any;

    @Column(DataType.DATE)
    expiresAt: Date;

    @Column(DataType.DATE)
    consumedAt: Date;
}