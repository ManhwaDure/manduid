import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    NotEmpty,
    NotNull,
    PrimaryKey,
    Table,
    Default
} from 'sequelize-typescript';
import md5 from 'md5';
import { User } from './User';

@Table
export class UserProfile extends Model<UserProfile> {
    @AllowNull(false)
    @NotNull
    @NotEmpty
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.STRING(180))
    id: string;

    //@Column hasCustomAvator: boolean;
    @Column introduction: string;

    @Column website: string;

    @Default(
        () =>
            `만두${Math.floor(Math.random() * 1000)
                .toString()
                .padStart(4, '0')}`
    )
    @Column
    nickname: string;

    @BelongsTo(() => User)
    user: User;

    async avatarUid(): Promise<string> {
        const user = await this.$get('user');
        return md5(user.emailAddress.trim().toLowerCase());
    }

    async avatarUrl(): Promise<string> {
        return '/avatar/' + (await this.avatarUid());
        //return 'https://id.caumd.club/avatar/' + md5(user.emailAddress.trim().toLowerCase());
    }

    async avatarFallbackUrl(): Promise<string> {
        return (await this.avatarUrl()) + '?fallback=yes';
        //return 'https://id.caumd.club/avatar/' + md5(user.emailAddress.trim().toLowerCase());
    }
}
