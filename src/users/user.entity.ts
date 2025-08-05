import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity()
@Unique(['username']) // Ensures usernames are unique
@Unique(['email'])    // Ensures emails are unique
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
    nullable: false,
  })
  @Index() // Improves search performance
  username: string;

  @Column({
    length: 100,
    nullable: false,
  })
  @Index() // Improves search performance
  email: string;

  @Column({
    length: 100,
    nullable: false,
    select: false, // Prevents password from being selected by default
  })
  password: string;

  @Column({
    name: 'is_admin', // Snake case for database column
    default: false,
    nullable: false,
  })
  isAdmin: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;
}