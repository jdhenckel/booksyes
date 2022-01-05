import React from 'react';
import logo from './booksyes.jpg';
import corner from './corner.png'
import Search from '../Search/Search';
import { Outlet } from 'react-router-dom';


export default function Main(props) {
    return <div className="App">
        <div className="sticky">
            <img src={logo} alt="Logo" />
            <img src={corner} className="bg topleft"  alt=""/>
            <img src={corner} className="bg topright"  alt=""/>
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
        <div className="footer sticky">
            <hr />
            <small><a href="mailto:bigt40@aol.com">Email Jan</a> | <a href="mailto:jdhenckel@gmail.com">Email Webmaster</a></small>
            <hr />
            <small>This way-cool web site developed by <a href="http://www.poorfox.com/">poorfox</a>.</small>
            <img src={corner} className="bg bottomleft"  alt=""/>
            <img src={corner} className="bg bottomright"  alt=""/>
        </div>
    </div>
}