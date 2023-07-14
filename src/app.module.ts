import { Module } from '@nestjs/common';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [EvaluationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
