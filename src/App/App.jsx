import React, { useState } from 'react';
import Catalog from '../Catalog/Catalog';
import NewCatalog from '../Catalog/NewCatalog';
import OrderReview from '../OrderReview/OrderReview';
import Categories from '../Categories/Categories';
import Cart from '../Cart/Cart';
import Success from '../Cart/Success';
import AboutUs from './AboutUs';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from '../Main/Main';

export default function App(props) {
  const [cart, setCart] = useState([]);
  const [cartSize, setCartSize] = useState(0);

  const updateCart = (removeFlag, book) => {
    var newCart = cart;
    if(removeFlag) {
      for (let i = 0; i < newCart.length; i++) {
        const element = newCart[i];
        if(element.title === book.title) {
          newCart.splice(i, 1);
          break;
        }
      }
    } else {
      newCart.push(book);
    }
    
    setCart(newCart);
    setCartSize(cart.length);
  }

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main cartcount={cartSize} />} >
        <Route path="/success" element={<Success />} />
        <Route exact path="/catalog/:type" > {/* This is the recommended way to handle optional perams per https://github.com/remix-run/react-router/issues/7285 */}
          <Route path="" element={<Catalog cart={cart} changeCart={updateCart}/>} />
          <Route path=":query" element={<Catalog cart={cart} changeCart={updateCart}/>} />
        </Route>
        <Route path="/categories" element={<Categories />} />
        <Route path="/newcatalog" element={<NewCatalog />} />
        <Route path="/cart" element={<Cart cart={cart} changeCart={updateCart} />} />
        <Route path="/revieworders" element={<OrderReview />} />
        <Route path="/" element={<AboutUs />} />
      </Route>
    </Routes>
  </BrowserRouter>
}
