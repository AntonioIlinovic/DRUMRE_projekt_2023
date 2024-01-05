import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Contextpage from '../Contextpage';
import { HiChevronLeft } from 'react-icons/hi';
import { APIKEY, firebaseConfig } from "../../importDB.js";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";

initializeApp(firebaseConfig);
const db = getFirestore();

export const Detalji = () => {
  const { loader, setLoader } = useContext(Contextpage);
  const { id } = useParams();
  const [moviedet, setMoviedet] = useState({});
  const [availability, setAvailability] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchMovieAvailability = async (title) => {
    const url = `https://streaming-availability.p.rapidapi.com/search/title?title=${encodeURIComponent(title)}&country=us&show_type=all&output_language=en`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '2fd0d3713emsh4f132c08f2483c4p1a121bjsna2da287a6809',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setAvailability(result);
    } catch (error) {
      console.error('Error fetching movie availability:', error);
    }
  };

  const dohvatiDetalje = async () => {
    try {
      const docRef = doc(db, 'Movies', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMoviedet(docSnap.data());
        setLoader(false);
        setDataLoaded(true);
        fetchMovieAvailability(docSnap.data().title); // Fetch availability based on the title
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
          fetchMovieAvailability(data.title); // Fetch availability based on the title
        } else {
          console.log('Movie not found in API.');
        }
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  useEffect(() => {
    dohvatiDetalje();
  }, [id]);

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
                {/* Movie details rendering */}
                {/* ... existing code to display movie details ... */}

                {/* Render movie availability if available */}
                {availability && (
                    <div className="text-white mt-4">
                      <h3 className="text-xl font-semibold">Streaming Availability:</h3>
                      {/* Process and display the availability data */}
                      {/* For example, list streaming services the movie is available on */}
                    </div>
                )}
              </div>
            </>
        )}
      </>
  );
};
