import React, { useEffect, useContext, useState } from 'react';
import Naslov from '../components/Naslov';
import Contextpage from '../Contextpage';
import Kartica from '../components/Kartica';
import { motion, AnimatePresence } from 'framer-motion';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../importDB.js';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

function Favorites() {
    const { user, loader } = useContext(Contextpage);
    const [bookmarkedMovies, setBookmarkedMovies] = useState([]);

    const isLoggedIn = !!user;

    useEffect(() => {
        const fetchBookmarkedMovies = async () => {
            if (user) {
                const bookmarksRef = collection(db, "Users", user.email, "BookmarkedMovies");
                const querySnapshot = await getDocs(bookmarksRef);
                const fetchedMovies = querySnapshot.docs.map(doc => doc.data());
                setBookmarkedMovies(fetchedMovies);
            }
        };

        fetchBookmarkedMovies();
    }, [user]);

    return (
        isLoggedIn ? (
            <>
                <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                    <Naslov />
                    <motion.div
                        layout
                        className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                        <AnimatePresence>
                            {
                                loader ? <span className="loader m-10"></span> :
                                    <>
                                        {bookmarkedMovies.map((movie, index) => (
                                            <Kartica key={index} movie={movie}/>))}
                                    </>
                            }
                        </AnimatePresence>
                    </motion.div>
                </div>
            </>
        ) : (
            <>
                <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                    <Naslov />
                    <motion.div
                        layout
                        className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                        <div className="text-white text-center">
                            <p className="text-lg">You are not logged in.</p>
                        </div>
                    </motion.div>
                </div>
            </>
        )
    );
}

export default Favorites;
