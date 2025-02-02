import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leader_board')
export class LeaderBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;
  @Column()
  gameId: string;
  @Column()
  score: number;
  @Column()
  timestamp: string;


}