import React, { useState, useContext } from "react";
import logo from "../../logo.png";
import { Link } from "react-router-dom";
import Contextpage from '../Contextpage';
import { FcGoogle } from 'react-icons/fc'
import { motion } from "framer-motion";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import { auth } from '../../firebase';

function Navigacija() {
    const { header, user } = useContext(Contextpage);
    const [activemobile, setActivemobile] = useState(false);

    const Navdata = [
        {
            id: 1,
            headername: "Popular Movies",
            Name: "Popular",
            link:"/"
        },
        {
            id: 2,
            headername: "Favorites",
            Name: "Favorites",
            link:"/favorites"
        },
        {
            id: 3,
            headername: "User",
            Name: "User",
            link:"/user"
        },
        {
            id: 4,
            headername: "From API",
            Name: "FromAPI",
            link : "/fromapi"
        }
    ]

    const { GoogleLogin } = useContext(Contextpage);

    return (
        <>
            <button className="z-40 text-3xl text-black fixed right-0 bottom-0 m-6 p-4 duration-150 rounded-full active:scale-90 bg-white block md:hidden" onClick={() => setActivemobile(!activemobile)}>
                {activemobile ? <HiX /> : <HiMenuAlt1 />}
            </button>

            <nav className={`${activemobile ? 'block' : 'hidden'} fixed bg-black/90 md:bg-black h-full w-full md:w-[15rem] z-30 md:block`}>
                <motion.div
                    animate={{ scale: 1 }}
                    initial={{ scale: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link to="/" className="logo flex flex-col justify-center items-center m-7 gap-2" onClick={() => setActivemobile(!activemobile)}>
                        <img src={logo} alt="logo" className="w-24" />
                        <h1 className={`text-red-500 font-bold text-2xl text-center`}>
                            Movies
                        </h1>
                    </Link>
                </motion.div>

                <ul className="text-white font-semibold text-[16px] text-center px-5">
                    {Navdata.map((data) => (
                        <Link key={data.id} to={data.link}>
                            <li className={`${header == data.headername ? 'border-red-600 text-white' : 'bg-gray-500/20 border-black'} p-2 my-2  hover:bg-black-500/20 rounded-[5px] border-2 hover:border-red-600`} onClick={() => setActivemobile(!activemobile)}>
                                {data.Name}
                            </li>
                        </Link>
                    ))}
                </ul>

                <div className="absolute bottom-0 w-full p-5 md:p-2 text-white">
                    {user ? (
                        <>
                            <div className="w-full bg-gray-900 px-5 py-2 gap-4 rounded-xl flex items-center font-semibold border-2 border-red-100/10">
                                <img src={user.photoURL} alt="user" className="h-10 rounded-full" />
                                <h1>{user.displayName}</h1>
                            </div>
                            <div className="cursor-pointer bg-red-500 flex justify-center items-center p-2 rounded-xl mt-2 hover:bg-red-500/20 rounded-[5px]" onClick={() => auth.signOut()}>
                                <h1>Logout</h1>
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-gray-900 py-2 gap-4 rounded-xl flex items-center justify-center font-semibold border-2 border-red-100/10 cursor-pointer hover:bg-black-500/20 rounded-[5px] border-2 hover:border-red-600" onClick={GoogleLogin}>
                            <FcGoogle className='text-3xl' />
                                <h1 className='text-white font-semibold'>Log in</h1>
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navigacija;
