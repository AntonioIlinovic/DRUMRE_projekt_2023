import React, {useEffect, useContext, useState} from 'react'
import Naslov from '../components/Naslov';
import Contextpage from '../Contextpage';
import Kartica from '../components/Kartica';
import {motion, AnimatePresence} from 'framer-motion';

function Favorites() {

    const {user, loader, GetFavorite} = useContext(Contextpage);
    const [localStorageData, setLocalStorageData] = useState([]);

    const isLoggedIn = !!user;

    useEffect(() => {
        GetFavorite();

        const data = localStorage;
        setLocalStorageData(data);
    }, []);

    return (
        isLoggedIn ? (
            <>
                <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                    <Naslov/>
                    <motion.div
                        layout
                        className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                        <AnimatePresence>
                            {
                                loader ? <span className="loader m-10"></span> :
                                    <>
                                        {Object.keys(localStorageData).filter(key => !isNaN(key)).map((key, index) => (
                                            <Kartica key={index} movie={{...JSON.parse(localStorageData[key])}}/>))}
                                    </>
                            }
                        </AnimatePresence>
                    </motion.div>
                </div>
            </>

        ) : (
            <>
                <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                    <Naslov/>
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