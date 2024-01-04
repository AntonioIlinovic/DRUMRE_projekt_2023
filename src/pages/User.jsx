import React, { useContext } from 'react';
import Naslov from '../components/Naslov';
import Contextpage from '../Contextpage';
import { motion } from 'framer-motion';

function User() {
    const { user } = useContext(Contextpage);

    // Check if user is logged in
    const isLoggedIn = !!user; // Converts user to a boolean value

    return (
        <>
            <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                <header
                    className={"flex  items-center justify-center text-3xl md:text-4xl font-bold text-red-500 py-3 px-5 md:px-10"}>
                    User Details
                </header>
                <motion.div
                    layout
                    className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                    <div className="text-white text-center">
                        <h1 className="text-2xl font-bold">User Info</h1>
                        {isLoggedIn ? (
                            <>
                                <p className="text-lg">Email: {user.email}</p>
                                <p className="text-lg">Name: {user.displayName || 'N/A'}</p>
                                {user.photoURL && (
                                    <img
                                        src={user.photoURL}
                                        alt="user"
                                        className="w-40 h-40 rounded-full mx-auto"
                                    />
                                )}
                            </>
                        ) : (
                            <p className="text-lg">You are not logged in.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default User;
