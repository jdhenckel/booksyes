import React, { useState, useEffect } from "react";
import "./BookEntry.css";
import newImage from "../images/new.gif";
//import noImage from "../images/noImage.jpg";

function BookEntry(props) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        getAllImages();
        // eslint-disable-next-line
    }, []);

    const getAllImages = () => {
        var imageNames = [];
        const names = props.book.imageSrc?.split(',');
        if(names) names.forEach(name => {
            imageNames.push('http://i1103.photobucket.com/albums/g478/booksyes/' + name + '.jpg');
            imageNames.push('http://hosting.photobucket.com/images/g478/booksyes/' + name + '.jpg');
        });

        setImages(imageNames);
    }

    const toCurrency = (num) => {
        return '$' + Number.parseFloat(num).toFixed(2)
    }

    const imageError = (e) => {
        e.target.style.display = 'none';
    }

    return (
        <div className="bookentry">
            <div><img className="bookImage" onError={imageError} src={'https://covers.openlibrary.org/b/isbn/' + props.book.ISBN + '-L.jpg?default=false'} alt="example Book cover"/></div>
            <div className="main">
                {props.book.isNew === "true" && <img id="newImage" src={newImage} alt="new!"/>}
                <span className="author">{props.book.author} </span>
                <span className="title">{props.book.title} </span>
                {props.book.description} 
                <span className="price"> {toCurrency(props.book.price)} </span>
            </div>
            {(images && images.length !== 0) && <div>
                <div className="caption">photo of the actual item</div>
                {images.map((image, index) => (
                    <img key={index} className="bookImage" onError={imageError} src={image} border="0" alt="actual book cover"/>
                ))}
            </div>}
        </div>
    );
}

export default BookEntry;