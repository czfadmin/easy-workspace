import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column({ comment: 'Password Hash' })
  password: string;
  @Column({
    default: '',
  })
  phonenumber: string;

  @Column()
  email: string;
  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    default: false,
  })
  isAdmin: boolean;
  @Column({
    default: '',
  })
  bio: string;
}
