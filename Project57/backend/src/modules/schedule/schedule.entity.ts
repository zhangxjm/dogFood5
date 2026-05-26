import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column({ type: 'date' })
  scheduleDate: string;

  @Column({ length: 20 })
  startTime: string;

  @Column({ length: 20 })
  endTime: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ length: 50, nullable: true })
  teacher: string;

  @Column({ default: 0 })
  maxStudents: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
