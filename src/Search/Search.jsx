import React, { useState, useEffect } from 'react';
import './Search.css';

export default function Search(props) {

    const [searchTerm, setSearchTerm] = useState("");
    const [scrolled, setScrolled] = useState(false);

    const searchFor = (e) => {
        e.preventDefault();
        console.log('You searched for: ' + searchTerm);
        props.searchCallback(searchTerm);
    }

    const browseCategories = (e) => {
        e.preventDefault();
        console.log('You clicked categories.');
        props.categoriesCallBack();
    }

    const searchRecent = (e) => {
        e.preventDefault();
        props.recentCallback();
        console.log('You clicked recent.');
    }

    const searchPhoto = (e) => {
        e.preventDefault();
        props.hasPhotoCallback();
        console.log('You clicked photos.');
    }

    const onChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const keydownHandler = (e) => {
        if (e.key === 'Enter') {
            props.searchCallback(searchTerm);
        }
    }

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
                    <button onClick={props.cartCallback}>View My Cart ({props.cartcount || "0"})</button>
                    <input type="text" className="field" placeholder="Search for" onChange={onChange} onKeyDown={keydownHandler} value={searchTerm}></input>
                    <button className="gobutton" onClick={searchFor}></button>
                </div>
                <div>
                    <button onClick={browseCategories}>Browse By Category</button>
                    <button onClick={searchRecent}>Find Recent Additions</button>
                    <button onClick={searchPhoto}>Find Books with a Photo</button>
                </div>
                {!scrolled && <small className="infotext">To search the catalog for a word or phrase, type it in the Search field and click on the GO! button.
To view the entire catalog, leave the Search field blank. To load the entire catalog takes about five minutes if you are using a slow connection.
To browse the catalog one section at a time, click the Browse by category button.</small>}
            </div>
        </div>
    );
}