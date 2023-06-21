import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refresh_token?: string;

    @Column({ type:'timestamp', precision: 6 , nullable: true })
    refresh_token_expires_at: Date;
}
