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
        // JOHN DIRTY HACK
        Promise.resolve({data:{"categories":["PICTURE BOOKS - FICTION","PICTURE-BOOK BIOGRAPHY","CHILDREN'S NON-FICTION - LIVING HISTORY PICTURE BOOKS","INSPIRATIONAL PICTURE BOOKS","SOFTCOVER CHILDREN'S PICTURE BOOKS","POETRY FOR CHILDREN - YOUNG PEOPLE","BIOGRAPHIES FOR YOUNG READERS","BIOGRAPHIES FOR OLDER CHILDREN - YOUNG ADULTS","CHRISTIAN BIOGRAPHIES","YOUNG READERS AMERICAN HISTORY - GEOGRAPHY","YOUNG READERS WORLD HISTORY - GEOGRAPHY","AMERICAN HISTORY - GEOGRAPHY FOR YOUNG PEOPLE","WORLD HISTORY - GEOGRAPHY FOR YOUNG PEOPLE","MINNESOTA BOOKS","ART - MUSIC FOR CHILDREN AND YOUNG PEOPLE","CHILDRENS ACTIVITY BOOKS - COOKBOOKS - HOBBIES - CRAFTS","USBORNE BOOKS","LIVING SCIENCE - NATURE - OTHER NON-FICTION","AMBLESIDE BIBLE","BIBLES - BIBLE STORIES - SCRIPTURE-BASED STORIES - DEVOTIONALS","EASY READERS - HISTORICAL FICTION-NON-FICTION","EASY READERS - FICTION","CHRISTIAN - INSPIRATIONAL FICTION FOR CHILDREN - YOUNG ADULTS","CHILDRENS - TEENS HISTORICAL FICTION","CHILDRENS - TEENS FICTION - LITERATURE","ANTIQUE - SIGNED - RARE AND COLLECTIBLE BOOKS","AMBLESIDE - SCM SOFTCOVERS","OTHER SOFTCOVERS","READERS - SPELLERS - CURRICULUM","FICTION - LITERATURE - YOUNG ADULTS - PARENTS","BIOGRAPHIES - MEMOIRS - YOUNG ADULTS - PARENTS","RAISING - EDUCATING CHILDREN - FAMILY RELATIONSHIPS","C. S. LEWIS","OTHER NON-FICTION - ADULTS - YOUNG ADULTS","CHRISTMAS BOOKS"]}})
//        axios.get('/.netlify/functions/categories')
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