import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

export default function Search(props) {
    const [lastCartCount, setLastCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const searchFor = () => {
        navigate(`./catalog/search/${searchTerm ?? "*"}`);
    }

    const browseCategories = () => {
        navigate(`./categories`);
    }

    const searchRecent = () => {
        navigate(`./catalog/recent/recent`);
    }

    const searchPhoto = () => {
        navigate(`./catalog/photos/has`);
    }

    const keydownHandler = (e) => {
        if (e.key === 'Enter') {
            searchFor();
        }
    }

    useEffect(() => {
        setTimeout(() => setLastCartCount(props.cartcount), 1000);
    }, [props]);

    useEffect(() => {
        const scrollHandler = () => {
            setScrolled((scrolled) => {
                if(!scrolled && (window.scrollY > 500)) return true;
                if(scrolled && (window.scrollY < 300)) return false;
                return scrolled;
            });
        }

        window.addEventListener("scroll", scrollHandler);

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    
    return (
        <div>
            <div className="search">
                <div>
                    <button onClick={() => navigate("/cart")} className={`shoppingcart ${(lastCartCount !== props.cartcount) ? 'rubberBand' : ''}`}>View My Cart ({props.cartcount || "0"})</button>
                    <input type="text" className="field" placeholder="Search for" onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={keydownHandler} value={searchTerm}></input>
                    <button onClick={searchFor}>Search</button>
                </div>
                <div>
                    <button onClick={browseCategories}>Browse By Category</button>
                    <button onClick={searchRecent}>Find Recent Additions</button>
                    <button onClick={searchPhoto}>Find Books with a Photo</button>
                </div>
                {!scrolled && <small className="infotext">
To browse the catalog one section at a time, click the Browse by category button.</small>}
            </div>
        </div>
    );
}