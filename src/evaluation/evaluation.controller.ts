import { Controller, Get, Query } from '@nestjs/common';
import { EvaluateSpeechQuery } from './models/evaluate-speech-query.model';
import { EvaluationService } from './evaluation.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get()
  evaluateSpeeches(@Query() query: EvaluateSpeechQuery) {
    return this.evaluationService.evaluateSpeech(query);
  }
}
