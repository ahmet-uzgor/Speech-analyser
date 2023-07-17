import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { HttpModule } from '@nestjs/axios';

describe('EvaluationService', () => {
  let service: EvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationService],
      imports: [HttpModule],
    }).compile();

    service = module.get<EvaluationService>(EvaluationService);
  });

  describe('getPoliticianWithMostSpeechesInYear', () => {
    it('should return the politician with the most speeches in a given year', () => {
      const speeches = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
        },
        {
          Speaker: 'Caesare Collins',
          Topic: 'Coal Subsidies',
          Date: '2012-11-06',
          Words: 1119,
        },
        {
          Speaker: 'Alexander Abel',
          Topic: 'Internal Security',
          Date: '2012-12-11',
          Words: 911,
        },
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-01-20',
          Words: 2000,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Internal Security',
          Date: '2012-02-05',
          Words: 1500,
        },
        {
          Speaker: 'Caesare Collins',
          Topic: 'Education Policy',
          Date: '2012-03-10',
          Words: 1800,
        },
      ];
      const year = 2013;
      const expected = null;

      const result = service.getPoliticianWithMostSpeechesInYear(
        speeches,
        year,
      );

      expect(result).toEqual(expected);
    });

    it('should return null if no speeches are available', () => {
      const speeches = [];
      const year = 2013;

      const result = service.getPoliticianWithMostSpeechesInYear(
        speeches,
        year,
      );

      expect(result).toBeNull();
    });
  });

  describe('getPoliticianWithMostSpeechesOnTopic', () => {
    it('should return the politician with the most speeches on a given topic', () => {
      const speeches = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
        },
        {
          Speaker: 'Caesare Collins',
          Topic: 'Coal Subsidies',
          Date: '2012-11-06',
          Words: 1119,
        },
        {
          Speaker: 'Alexander Abel',
          Topic: 'Internal Security',
          Date: '2012-12-11',
          Words: 911,
        },
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2013-01-20',
          Words: 2000,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Internal Security',
          Date: '2013-02-05',
          Words: 1500,
        },
        {
          Speaker: 'Caesare Collins',
          Topic: 'Education Policy',
          Date: '2013-03-10',
          Words: 1800,
        },
      ];
      const topic = 'Education Policy';
      const expected = 'Alexander Abel';

      const result = service.getPoliticianWithMostSpeechesOnTopic(
        speeches,
        topic,
      );

      expect(result).toEqual(expected);
    });

    it('should return null if no speeches are available', () => {
      const speeches = [];
      const topic = 'Education Policy';

      const result = service.getPoliticianWithMostSpeechesOnTopic(
        speeches,
        topic,
      );

      expect(result).toBeNull();
    });
  });

  describe('getPoliticianWithFewestWords', () => {
    it('should return the politician with the fewest words in total', () => {
      const speeches = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
        },
        {
          Speaker: 'Caesare Collins',
          Topic: 'Coal Subsidies',
          Date: '2012-11-06',
          Words: 1119,
        },
        {
          Speaker: 'Alexander Abel',
          Topic: 'Internal Security',
          Date: '2012-12-11',
          Words: 911,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Education Policy',
          Date: '2013-01-20',
          Words: 2000,
        },
        {
          Speaker: 'Caesare Collins',
          Topic: 'Internal Security',
          Date: '2013-02-05',
          Words: 1500,
        },
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2013-03-10',
          Words: 1800,
        },
      ];
      const expected = 'Caesare Collins';

      const result = service.getPoliticianWithFewestWords(speeches);

      expect(result).toEqual(expected);
    });

    it('should return null if no speeches are available', () => {
      const speeches = [];

      const result = service.getPoliticianWithFewestWords(speeches);

      expect(result).toBeNull();
    });
  });
});
