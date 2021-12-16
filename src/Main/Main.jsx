import React, { useEffect, useState } from 'react';
import logo from './booksyes.jpg';
import Search from '../Search/Search';
import { Outlet } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';


export default function Main(props) {
    return <div className="App">
        <div className="sticky">
            <img src={logo} alt="Logo" />

            <h2>Jan Wright</h2>
            <h3>17105 Nowthen Blvd., Anoka, MN 55303</h3>
            <h3>763-753-3429</h3>
            <hr />
            <h3>Used, collectible, and out-of-print books -- good books -- for children and young people of all ages!</h3>
        </div>
        <div className="header sticky top">
            <Search cartcount={props.cartcount} />
        </div>
        <Outlet />
        <div className="footer sticky bottom">
            <hr />
            <small><a href="mailto:bigt40@aol.com">Email Jan</a> | <a href="mailto:jdhenckel@gmail.com">Email Webmaster</a></small>
            <hr />
            <small>This way-cool web site developed by <a href="www.poorfox.com">poorfox</a>.</small>
        </div>
    </div>
}