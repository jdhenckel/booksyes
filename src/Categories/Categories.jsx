import axios from "axios";
import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './Categories.css';

export default function Categories(props) {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/.netlify/functions/categories')
        .then(response => {
            const categories = response.data.categories;
            setCategoryList(categories);
        })
    }, []);

    const pickCategory = (category) => {
        navigate(`../catalog/category/${category}`)
    }

    return <div className="categories">
        {categoryList.map((c, index) => (
            <button className={index % 2 === 0 ? "even" : "odd"} key={index} onClick={() => pickCategory(c)}>{c}</button>
            ))}
    </div>
}