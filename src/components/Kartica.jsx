import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Contextpage from '../Contextpage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../importDB.js';
import {doc, getDoc, getFirestore, setDoc, deleteDoc} from "firebase/firestore";


// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

function Kartica({ movie }) {
    const { user } = useContext(Contextpage);
    const [isBookmarked, setIsBookmarked] = useState(null);

    useEffect(() => {
        const checkBookmark = async () => {
            if (user) {
                const movieRef = doc(db, "Users", user.email, "BookmarkedMovies", movie.id.toString());
                const docSnap = await getDoc(movieRef);
                setIsBookmarked(docSnap.exists());
            }
        };

        checkBookmark();
    }, [user, movie.id]);

    const BookmarkMovie = async () => {
        if (user) {
            const movieRef = doc(db, "Users", user.email, "BookmarkedMovies", movie.id.toString());
            setIsBookmarked(!isBookmarked);
            if (isBookmarked) {
                await deleteDoc(movieRef);
            } else {
                await setDoc(movieRef, {...movie});
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            layout
            className="card relative w-[200px] h-[300px] my-3 mx-2 md:my-4 md:mx-0 cursor-pointer rounded-xl overflow-hidden"
        >
            <button className="absolute bg-black text-white p-2 z-20 right-0 m-2 rounded-full text-lg" onClick={BookmarkMovie}>
                {isBookmarked ? <AiFillHeart style={{ color: 'red' }} /> : <AiOutlineHeart style={{ color: 'red' }} />}
            </button>

            <div className='absolute bottom-0 w-full flex justify-between items-end p-2 z-20'>
                <h1 className='text-white text-lg font-semibold break-normal break-words'>{movie.title || movie.name}</h1>
                {(movie.vote_average || 0) > 7 ? <h1 className='font-bold text-green-500 p-1 bg-zinc-900 rounded-full text-sm'>{(movie.vote_average || 0).toFixed(1)}</h1> : (movie.vote_average || 0) > 5.5 ? <h1 className='font-bold text-orange-400 p-1 bg-zinc-900 rounded-full text-sm'>{(movie.vote_average || 0).toFixed(1)}</h1> : <h1 className='font-bold text-red-600 p-1 bg-zinc-900 rounded-full text-sm'>{(movie.vote_average || 0).toFixed(1)}</h1>}
            </div>

            <Link to={`/moviedetail/${movie.id}`} className='h-full w-full shadow absolute z-10'></Link>

            <div>
                {movie.poster_path !== null && (
                    <LazyLoadImage className='img object-cover' src={"https://image.tmdb.org/t/p/w500" + movie.poster_path} />
                )}
            </div>
        </motion.div>
    )
}

export default Kartica;
