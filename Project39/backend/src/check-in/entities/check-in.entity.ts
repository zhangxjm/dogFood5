import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FitnessPlan } from '../../fitness-plan/entities/fitness-plan.entity';

@Entity()
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  planId: number;

  @Column('date')
  checkInDate: string;

  @Column('jsonb')
  completedExercises: CompletedExercise[];

  @Column('text', { nullable: true })
  notes: string;

  @Column({ default: 0 })
  caloriesBurned: number;

  @Column({ default: 0 })
  durationMinutes: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => FitnessPlan, plan => plan.checkIns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: FitnessPlan;
}

export interface CompletedExercise {
  name: string;
  completedSets: number;
  completedReps: number;
  duration?: number;
}
