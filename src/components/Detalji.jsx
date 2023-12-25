import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Contextpage from '../Contextpage';
import { HiChevronLeft } from 'react-icons/hi';
import { APIKEY, firebaseConfig } from "../../importDB.js";
import {initializeApp} from "firebase/app";
import {doc, getFirestore, getDoc} from "firebase/firestore";

initializeApp(firebaseConfig);
const db = getFirestore();

export const Detalji = () => {
  const { loader, setLoader } = useContext(Contextpage);
  const { id } = useParams();
  const [moviedet, setMoviedet] = useState({});
  const [moviegenres, setMoviegenres] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const dohvatiDetalje = async () => {
    try {
      const docRef = doc(db, 'movies', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMoviedet(docSnap.data());
        setLoader(false);
        setDataLoaded(true);
      } else {
        console.log('No such document! Fetching from API...');

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}&language=en-US`
        );

        if (response.ok) {
          const data = await response.json();
          setMoviedet(data);
          setLoader(false);
          setDataLoaded(true);
        } else {
          console.log('Movie not found in API.');
          // Handle the case where the movie is not found in both database and API
        }
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  useEffect(() => {
    dohvatiDetalje();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

              <div className="relative h-auto md:h-[82vh] flex flex-col items-center">
                {moviedet.backdrop_path !== null && (
                    <img
                        src={"https://image.tmdb.org/t/p/original" + moviedet.backdrop_path}
                        className="h-full w-full rounded-lg"
                        alt={moviedet.title}
                    />
                )}
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-transparent w-full text-center">
                  <h1 className="text-red-500 text-2xl md:text-6xl font-bold py-3">
                    {moviedet.title}
                  </h1>
                </div>

                <div className="mt-8 text-white">
                  <table className="mx-auto table-auto">
                    <tbody>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Overview:</td>
                      <td className="px-4 py-2">{moviedet.overview}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Vote Average:</td>
                      <td className="px-4 py-2">{moviedet.vote_average}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Vote Count:</td>
                      <td className="px-4 py-2">{moviedet.vote_count}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Release Date:</td>
                      <td className="px-4 py-2">{moviedet.release_date}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Original Language:</td>
                      <td className="px-4 py-2">{moviedet.original_language}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Adult:</td>
                      <td className="px-4 py-2">{moviedet.adult ? 'Yes' : 'No'}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
        )}
      </>
  );



};