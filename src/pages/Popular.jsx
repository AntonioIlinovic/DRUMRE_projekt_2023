import { initializeApp } from "firebase/app";
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Your Firebase configuration file

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const moviesCol = collection(db, 'movies');
                const movieSnapshot = await getDocs(moviesCol);
                const moviesList = movieSnapshot.docs.map(doc => doc.data());
                setMovies(moviesList);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
            setLoading(false);
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <div>Loading movies...</div>;
    }

    return (
        <div>
            <h2>Movies List</h2>
            {movies.map((movie, index) => (
                <div key={index}>
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    <p>Release Date: {movie.release_date}</p>
                </div>
            ))}
        </div>
    );
};

export default MoviesList;
