import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CheckIn } from '../../check-in/entities/check-in.entity';

@Entity()
export class FitnessPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('jsonb')
  exercises: Exercise[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CheckIn, checkIn => checkIn.plan)
  checkIns: CheckIn[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  restTime?: number;
}
