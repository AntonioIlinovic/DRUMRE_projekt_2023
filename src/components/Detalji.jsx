import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Contextpage from '../Contextpage';
import { HiChevronLeft } from 'react-icons/hi';
import { APIKEY } from "../../importDB.js";

export const Detalji = () => {
  const { loader, setLoader } = useContext(Contextpage);
  const { id } = useParams();
  const [moviedet, setMoviedet] = useState([]);
  const [moviegenres, setMoviegenres] = useState([]);

  const dohvatiDetalje = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}&language=en-US`
    );
    const moviedetail = await data.json();
    setMoviedet(moviedetail);
    setLoader(false);
  };

  useEffect(() => {
    dohvatiDetalje();
  }, []);

  return (
    <>
      {loader ? (
        <div className="h-screen w-full flex justify-center items-center">
          <span className="loader m-10"></span>
        </div>
      ) : (
        <>
          <Link to="/" className="fixed z-10 text-4xl bg-black m-3 md:m-5 rounded-full p-2">
            <HiChevronLeft style={{ color: 'white', fontSize: '24px' }} />
          </Link>

          <div className="relative h-auto md:h-[82vh] flex justify-center">
            <div className="h-full w-full shadowbackdrop absolute"></div>
            <h1 className="text-red-500 absolute bottom-0 p-10 text-2xl md:text-6xl font-bold text-center">
              {moviedet.title}
            </h1>
            {moviedet.backdrop_path !== null && (
              <img
                src={"https://image.tmdb.org/t/p/original/" + moviedet.backdrop_path}
                className="h-full w-full"
              />
            )}
          </div>

          <h2 className="text-white text-center pt-5 px-3 md:px-60 font-Roboto text-[18px]">
            {moviedet.overview}
          </h2>

          <div className="flex justify-center flex-wrap">
            {moviegenres.map((tag) => (
              <div key={tag.id} className="text-white font-semibold bg-gray-800 rounded-full px-4 py-1 m-2">
                {tag.name}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
