import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import BookEntry from "./BookEntry";
import CartButton from "./CartButton";
import "./Catalog.css";

export default function Catalog(props) {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const cart = useState(props.cart ?? []);

    const {type, query} = useParams();


    useEffect(() => {
        var url = '';
        switch(type) {
            case 'category':
                url = `/.netlify/functions/bycategory?query=${query ?? ''}`
                break;
            case 'recent':
                url = '/.netlify/functions/new';
                break;
            case 'photos':
                url = '/.netlify/functions/hasphoto';
                break;
            case 'search':
                url = `/.netlify/functions/search?query=${query === '*' ? '' : query ?? ''}`
                break;
            default:
                return;
        }
        setLoading(true);
        axios.get(url)
        .then(res => {
            handleResponse(res);
        }).finally(() => {
            setLoading(false);
        });
    }, [type, query]);

    const handleResponse = (res) => {
        setBooks(res.data.books);
    }

    const changeCart = (removeFlag, book) => {
        props.changeCart(removeFlag, book);
    }

    const inCart = (book) => {
        return cart.some(e => e.search === book.search);
    }

    return(
        <div className="catalog">
            <Spinner loading={loading} >
                {(books === undefined || books.length === 0) && <h3>This query returned no results.</h3>}
                
                {books.map((b, index) => (
                    <div key={index} className={index % 2 === 0 ? "bookContainer even" : "bookContainer odd"}>
                        <CartButton inCart={inCart(b)} clickCallback={(action) => changeCart(action, b)} />
                        <BookEntry book={b}></BookEntry>
                    </div>
                ))}
            </Spinner>
        </div>
    );
}