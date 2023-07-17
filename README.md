This repo includes case solution codes for Speech Analysing task written by [Ahmet Üzgör](https://www.linkedin.com/in/ahmet-uzgor-a1397a134/)
# Political Speeches Evaluation

The Political Speeches Evaluation is a Nest.js application that calculates statistics from given input data about political speeches. It handles CSV files, structured with Speaker, Topic, Date, and Words columns, and provides an HTTP endpoint for evaluating the data and answering specific questions.

## Features

- Download and process CSV files containing political speeches data.
- Answer the following questions based on the input data:
  1. Which politician gave the most speeches in a specific year?
  2. Which politician gave the most speeches on a particular topic?
  3. Which politician used the fewest words in total?
- Return the calculated statistics as JSON.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/political-speeches-evaluation.git
   ```

2. Navigate to the project directory:

   ```bash
   cd political-speeches-evaluation
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the application:

   ```bash
   npm run start
   ```
  
  # for development purposes
   ```bash
   npm run start:dev
   ```

2. The application will be running at `http://localhost:3000`.

3. Use the following endpoint to evaluate the speeches:

   ```
   GET /evaluation?url=url1&url=url2
   ```

   - Replace `url1`, `url2`, etc. with the URLs of the CSV files you want to evaluate.
   - You can pass multiple URLs as query parameters to evaluate multiple files.

4. The endpoint will return a JSON object containing the calculated statistics:

   ```json
   {
     "mostSpeeches2013": "Alexander Abel",
     "mostSpeechesInternalSecurity": "Bernhard Belling",
     "fewestWords": "Caesare Collins"
   }
   ```

## Additional Information

- The application assumes that the CSV files are UTF-8 encoded.
- The CSV files should have the following structure: Speaker, Topic, Date, Words.
- The application utilizes the Nest.js framework for building the API endpoint and handling HTTP requests.
- The CSV files are downloaded using the `HttpService` provided by Nest.js and are parsed using the `papaparse` library.
- The application provides unit tests for the controller and service functions using the Jest testing framework.
- The tests can be executed using the `npm run test` command.

## Functions in EvaluationService

The `EvaluationService` class contains the following functions:

### `getPoliticianWithMostSpeechesInYear(speeches: Speech[], year: number): string | null`

This function takes an array of `speeches` and a `year` as input and returns the name of the politician who gave the most speeches in the specified year. If no speeches are available or if there is a tie between multiple politicians, it returns `null`.

### `getPoliticianWithMostSpeechesOnTopic(speeches: Speech[], topic: string): string | null`

This function takes an array of `speeches` and a `topic` as input and returns the name of the politician who gave the most speeches on the specified topic. If no speeches are available or if there is a tie between multiple politicians, it returns `null`.

### `getPoliticianWithFewestWords(speeches: Speech[]): string | null`

This function takes an array of `speeches` as input and returns the name of the politician who used the fewest words in total. If no speeches are available or if there is a tie between multiple politicians, it returns `null`.

### `downloadAndParseCSVs(urls: string[]): Promise<Speech[]>`

This function takes an array of `urls` as input, downloads the CSV files from the provided URLs, and parses them into an array of `Speech` objects. It returns a promise that resolves to the array of parsed speeches. If no URLs are provided or if there are errors in downloading the files, it returns an empty array.