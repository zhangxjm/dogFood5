import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FitnessPlan } from './fitness-plan.entity';

@Entity('check_ins')
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FitnessPlan, fitnessPlan => fitnessPlan.checkIns, { eager: true })
  @JoinColumn({ name: 'fitness_plan_id' })
  fitnessPlan: FitnessPlan;

  @Column({ name: 'fitness_plan_id' })
  fitnessPlanId: number;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'boolean', default: true })
  completed: boolean;

  @Column({ type: 'int', default: 0 })
  caloriesBurned: number;

  @Column({ type: 'int', default: 0 })
  durationMinutes: number;

  @Column({ length: 500, nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
