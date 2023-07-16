import { Injectable } from '@nestjs/common';
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
    const urls = typeof url === 'string' ? [url] : url;
    const responses: AxiosResponse[] = await Promise.all(
      urls?.map((url) => lastValueFrom(this.httpService.get(url))),
    );

    const speeches: Speech[] = [];

    for (const response of responses) {
      const parsed: any = parse(response.data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        // it checks whether headers first char is empty space or not and fix it
        transformHeader: function (header) {
          header = header[0] === ' ' ? header.slice(1) : header;
          return header;
        },
        // it checks whether values first char is empty space or not and fix it
        transform: function (value) {
          value = value[0] === ' ' ? value.slice(1) : value;
          return value;
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

  private getPoliticianWithFewestWords(speeches: any[]): string {
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
