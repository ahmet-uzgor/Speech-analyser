import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { EvaluationController } from './evaluation.controller';
import { Observable } from 'rxjs';
import { EvaluationService } from './evaluation.service';
import { EvaluationModule } from './evaluation.module';

describe('EvaluationController', () => {
  let controller: EvaluationController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EvaluationModule, HttpModule],
      controllers: [EvaluationController],
      providers: [EvaluationService],
    }).compile();

    controller = module.get<EvaluationController>(EvaluationController);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('evaluate', () => {
    const csvData = `Speaker,Topic,Date,Words
      Alexander Abel,Education Policy,2012-10-30,5310
      Bernhard Belling,Coal Subsidies,2012-11-05,1210
      Caesare Collins,Coal Subsidies,2012-11-06,1119
      Alexander Abel,Internal Security,2012-12-11,911`;

    const csvUrl = 'https://example.com/politics.csv';
    const csvResponse: AxiosResponse = {
      data: csvData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    beforeEach(() => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return new Observable((subscribe) => {
          subscribe.next(csvResponse);
          subscribe.complete();
        });
      });
    });

    it('should calculate the politician with the most speeches in 2013', async () => {
      const urls = [csvUrl];
      const expected = null;

      const result = await controller.evaluateSpeeches({ url: urls });

      expect(httpService.get).toHaveBeenCalledWith(csvUrl);
      expect(result.mostSpeeches).toEqual(expected);
    });

    it('should calculate the politician with the most speeches on "Internal Security"', async () => {
      const urls = [csvUrl];
      const expected = 'Alexander Abel';

      const result = await controller.evaluateSpeeches({ url: urls });

      expect(httpService.get).toHaveBeenCalledWith(csvUrl);
      expect(result.mostSecurity).toEqual(expected);
    });

    it('should calculate the politician with the fewest words', async () => {
      const urls = [csvUrl];
      const expected = 'Caesare Collins';

      const result = await controller.evaluateSpeeches({ url: urls });

      expect(httpService.get).toHaveBeenCalledWith(csvUrl);
      expect(result.leastWordy).toEqual(expected);
    });

    it('should return null for questions without unambiguous solutions', async () => {
      const urls = [csvUrl];

      const result = await controller.evaluateSpeeches({ url: urls });

      expect(httpService.get).toHaveBeenCalledWith(csvUrl);
      expect(result.mostSpeeches).toBeNull();
    });

    it('should return null if no speeches are available', async () => {
      const urls = [csvUrl];
      const emptyCsvData = 'Speaker,Topic,Date,Words\n';

      const emptyCsvResponse: AxiosResponse = {
        data: emptyCsvData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return new Observable((subscribe) => {
          subscribe.next(emptyCsvResponse);
          subscribe.complete();
        });
      });

      const result = await controller.evaluateSpeeches({ url: urls });

      expect(httpService.get).toHaveBeenCalledWith(csvUrl);
      expect(result.mostSpeeches).toBeNull();
      expect(result.mostSecurity).toBeNull();
      expect(result.leastWordy).toBeNull();
    });
  });
});
