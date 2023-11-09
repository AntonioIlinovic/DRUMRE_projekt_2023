import React,{useEffect, useContext} from "react";
import Contextpage from '../Contextpage'
import { useParams } from 'react-router-dom'
import Filmovi from "../components/Filmovi";
import Trazilica from "../components/Trazilica";
import Search from "./Search"

function Main() {
    const { setMovies } = useContext(Contextpage);
    const { query } = useParams()
    return (
        <section>
        <Trazilica />
        {query ? <Search query={query} /> : <Filmovi />}
        </section>
    )
}

export default Main;
