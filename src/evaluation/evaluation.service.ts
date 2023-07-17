import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { EvaluateSpeechQuery } from './evaluate-speech-query.model';
import { EvaluateSpeechResponse } from './evaluate-speech-response.model';
import { Speech } from './speech.model';
import { parse } from 'papaparse';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EvaluationService {
  constructor(private httpService: HttpService) {}

  async evaluateSpeech(
    evaluateSpeechQuery: EvaluateSpeechQuery,
  ): Promise<EvaluateSpeechResponse> {
    const { url } = evaluateSpeechQuery;

    if (!url) {
      throw new BadRequestException('csv urls is not given in query');
    }

    const speeches: Speech[] = await this.downloadAndParseCSVs(url);

    return {
      mostSpeeches: this.getPoliticianWithMostSpeechesInYear(speeches, 2013),
      mostSecurity: this.getPoliticianWithMostSpeechesOnTopic(
        speeches,
        'Internal Security',
      ),
      leastWordy: this.getPoliticianWithFewestWords(speeches),
    };
  }

  private async downloadAndParseCSVs(
    url: string | string[],
  ): Promise<Speech[]> {
    // if there is only one url then set urls as array to handle it
    const urls = typeof url === 'string' ? [url] : url;
    const responses: AxiosResponse[] = [];

    for (let i = 0; i < urls.length; i++) {
      try {
        responses.push(await lastValueFrom(this.httpService.get(urls[i])));
      } catch (_) {
        // it caches error if any of url is broken or not found,
        // it provides taking all datas from valid download urls
      }
    }

    // if there is no data or all urls are broken then throws an exception
    if (responses.length < 1) {
      throw new BadRequestException('Given urls are broken or not found');
    }

    const speeches: Speech[] = [];

    // it parses all csv data which is downloaded and adds to speeches
    // papaparse library has built-in methods to fix problems on parsing
    for (const response of responses) {
      const parsed = parse<Speech>(response.data, {
        header: true,
        // it changes number in string to number
        dynamicTyping: true,
        skipEmptyLines: true,
        // it checks whether headers first char is empty space or not and fix it
        transformHeader: function (header) {
          header = header.trimStart();
          return header;
        },
        // it checks whether values first char is empty space or not and fix it
        transform: function (value) {
          return value.trimStart();
        },
      }).data;

      speeches.push(...parsed);
    }

    return speeches;
  }

  private getPoliticianWithMostSpeechesInYear(
    speeches: Speech[],
    year: number,
  ): string {
    // it filters speeches in specific given year parameter
    const speechesInYear = speeches.filter(
      (speech) => new Date(speech.Date).getFullYear() === year,
    );

    if (speechesInYear.length === 0) {
      return null;
    }

    const politicians = speechesInYear.reduce((acc, speech) => {
      acc[speech.Speaker] = (acc[speech.Speaker] || 0) + 1;
      return acc;
    }, {});

    const mostSpeeches = Math.max(...(Object.values(politicians) as number[]));
    const politiciansWithMostSpeeches = Object.keys(politicians).filter(
      (politician) => politicians[politician] === mostSpeeches,
    );

    return politiciansWithMostSpeeches.length === 1
      ? politiciansWithMostSpeeches[0]
      : null;
  }

  private getPoliticianWithMostSpeechesOnTopic(
    speeches: Speech[],
    topic: string,
  ): string {
    // it filters speeches in specific given topic param
    const speechesOnTopic = speeches.filter((speech) => speech.Topic === topic);

    if (speechesOnTopic.length === 0) {
      return null;
    }

    const politicians = speechesOnTopic.reduce((acc, speech) => {
      acc[speech.Speaker] = (acc[speech.Speaker] || 0) + 1;
      return acc;
    }, {});

    const mostSpeeches = Math.max(...(Object.values(politicians) as number[]));
    const politiciansWithMostSpeeches = Object.keys(politicians).filter(
      (politician) => politicians[politician] === mostSpeeches,
    );

    return politiciansWithMostSpeeches.length === 1
      ? politiciansWithMostSpeeches[0]
      : null;
  }

  private getPoliticianWithFewestWords(speeches: Speech[]): string {
    if (speeches.length === 0) {
      return null;
    }

    const politicians = speeches.reduce((acc, speech) => {
      acc[speech.Speaker] = acc[speech.Speaker]
        ? acc[speech.Speaker] + speech.Words
        : speech.Words;
      return acc;
    }, {});

    const fewestWords = Math.min(...(Object.values(politicians) as number[]));
    const politiciansWithFewestWords = Object.keys(politicians).filter(
      (politician) => politicians[politician] === fewestWords,
    );

    return politiciansWithFewestWords.length === 1
      ? politiciansWithFewestWords[0]
      : null;
  }
}
