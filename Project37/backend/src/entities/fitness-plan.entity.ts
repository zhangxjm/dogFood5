import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CheckIn } from './check-in.entity';

@Entity('fitness_plans')
export class FitnessPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ type: 'int', default: 30 })
  duration: number;

  @Column('simple-array', { nullable: true })
  exercises: string[];

  @Column({ type: 'int', default: 5 })
  frequencyPerWeek: number;

  @Column({ length: 20, default: 'beginner' })
  difficulty: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CheckIn, checkIn => checkIn.fitnessPlan)
  checkIns: CheckIn[];
}
