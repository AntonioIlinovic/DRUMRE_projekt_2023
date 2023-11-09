import fs from 'fs';
import axios from 'axios';

// Define the IMDb dataset URL
const IMDB_DATASET_URL = 'https://datasets.imdbws.com/name.basics.tsv.gz';

// Define the file to save the movie info to
const MOVIE_INFO_FILE = 'movie_info.tsv';

// Define the number of movie info to download
const NUMBER_OF_MOVIES_TO_DOWNLOAD = 1000;

// Create an async function to download the movie info
async function downloadMovieInfo() {
    // Download the IMDb dataset file
    const response = await axios.get(IMDB_DATASET_URL);

    // Check if the request was successful
    if (response.status === 200) {
        // Open the dataset file for reading
        const datasetFile = fs.createReadStream(response.data.path);

        // Create a writable stream to save the movie info to
        const movieInfoFile = fs.createWriteStream(MOVIE_INFO_FILE);

        // Create a counter to track the number of movie info downloaded
        let movieInfoCount = 0;

        // Read the dataset file line by line
        for await (const line of datasetFile) {
            // Split the line into columns
            const columns = line.split('\t');

            // Get the title type
            const titleType = columns[1];

            // If the title type is a movie, save the movie info to the file
            if (titleType === 'movie') {
                movieInfoFile.write(line);
                movieInfoCount++;
            }

            // If the movie info count has reached the desired number, stop reading the dataset file
            if (movieInfoCount === NUMBER_OF_MOVIES_TO_DOWNLOAD) {
                break;
            }
        }

        // Close the writable stream
        movieInfoFile.end();

        console.log(`Successfully downloaded ${movieInfoCount} movie info to ${MOVIE_INFO_FILE}`);
    } else {
        console.error(`Failed to download IMDb dataset: ${response.statusText}`);
    }
}

// Download the movie info
downloadMovieInfo();
