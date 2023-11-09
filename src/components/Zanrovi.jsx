import React, { useEffect, useContext } from 'react';
import Contextpage from '../Contextpage';

function Zanrovi() {
    const { fetchGenre, activegenre, setActiveGenre, genres } = useContext(Contextpage);

    useEffect(() => {
        fetchGenre();
    }, []);

    const genresToDisplay = [
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
        'Science fiction',
        'Romance',
        'Fantasy',
        'Horror',
        'Mystery',
        'Animation',
        'Science Fiction',
    ];

    return (
        <>
            <div className='flex flex-wrap justify-center px-2'>
                {genresToDisplay.map((genreName) => {
                    const genre = genres.find((g) => g.name === genreName);
                    if (genre) {
                        return (
                            <button
                                onClick={() => setActiveGenre(genre.id)}
                                className={
                                    activegenre === genre.id
                                        ? 'px-4 py-2 m-2 text-[15px] bg-red-500 text-white font-semibold rounded-3xl' // Use 'bg-red-500' for red color
                                        : 'px-4 py-2 m-2 text-[15px] bg-slate-800 text-white font-semibold rounded-3xl'
                                }
                                key={genre.id}
                            >
                                {genre.name}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
        </>
    );
}

export default Zanrovi;
