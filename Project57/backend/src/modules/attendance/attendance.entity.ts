import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scheduleId: number;

  @Column()
  registrationId: number;

  @Column({ length: 50 })
  childName: string;

  @Column({ default: 'absent' })
  status: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
