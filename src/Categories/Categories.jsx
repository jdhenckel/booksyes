import axios from "axios";
import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Spinner from "../Spinner/Spinner";
import './Categories.css';

export default function Categories(props) {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('/.netlify/functions/categories')
        .then(response => {
            const categories = response.data.categories;
            setCategoryList(categories);
        }).finally(() => {
            setLoading(false);
        })
    }, []);

    const pickCategory = (category) => {
        navigate(`../catalog/category/${category}`)
    }

    return <div className="categories">
        <Spinner loading={loading} />
        {categoryList.map((c, index) => (
            <button className={index % 2 === 0 ? "even" : "odd"} key={index} onClick={() => pickCategory(c)}>{c}</button>
            ))}
    </div>
}