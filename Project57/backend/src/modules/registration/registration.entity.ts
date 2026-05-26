import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column({ length: 50 })
  parentName: string;

  @Column({ length: 20 })
  parentPhone: string;

  @Column({ length: 50 })
  childName: string;

  @Column({ type: 'int' })
  childAge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  paymentStatus: string;

  @Column({ length: 100, nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
