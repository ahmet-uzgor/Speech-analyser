import { Controller, Get, Param } from '@nestjs/common';
import { EvaluateSpeechParams } from './evaluate-speech-params.model';
import { EvaluationService } from './evaluation.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get()
  evaluateSpeeches(@Param() params: EvaluateSpeechParams) {
    return this.evaluationService.evaluateSpeech(params);
  }
}
