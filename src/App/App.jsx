import React, { Component } from 'react';
import axios from 'axios';
import Catalog from '../Catalog/Catalog';
import Search from '../Search/Search';
import Categories from '../Categories/Categories';
import Cart from '../Cart/Cart';
import Success from '../Cart/Success';
import './App.css';
import logo from './booksyes.jpg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      categories: [],
      loading: false,
      showCatalog: false,
      showCategories: false,
      showCart: false,
      showSuccess: false,
      cart: [],
    }
  }

  startLoading = () => {
    this.setState(() => {
      return {
        loading: true,
      }
    })
  }

  stopLoading = () => {
    this.setState(() => {
      return {
        loading: false,
      }
    })
  }

  handleRequest = (url, query, onReturn) => {
    this.startLoading();
    axios.get("/.netlify/functions/" + url, {
      params: {
        query: query?.toString()
      }
    }).then(response => {
      console.log(response.data);
      onReturn(response.data);
    }).finally(() => {
      this.stopLoading();
    });
  }

  showModule = (moduleName) => {
    var newstate = {
      showCatalog: false,
      showCategories: false,
      showCart: false,
      showSuccess: false,
    };

    switch (moduleName) {
      case 'catalog':
        newstate.showCatalog = true;
        break;
      case 'categories':
        newstate.showCategories = true;
        break;
      case 'cart':
        newstate.showCart = true;
        break;
      case 'success':
        newstate.showSuccess = true;
        break;
      default:
    }

    this.setState((state, props) => {
      return newstate;
    });
  }

  populateCatelog = (books) => {
    this.showModule('catalog');
    this.setState((state, props) => {
      return {
        books: books,
      };
    });
  };

  categoryCallBack = () => {
    

    if(this.state.categories.length !== 0) {
      this.showModule('categories');
      return;
    }

    this.handleRequest("categories", null, (data) => {
      
      this.setState((state, props) => {
        return {
          categories: data.categories,
        };
      });
      this.showModule('categories');
    });
  }

  pickCategory = (category) => {
    this.handleRequest("bycategory", category, (data) => {
      this.populateCatelog(data.books); 
    });
  }

  handleSearch = (searchData) => {
    this.handleRequest("search", searchData, (data) => {
      this.populateCatelog(data.books);
    });
  };

  getRecent = () => {
    this.handleRequest("new", null, (data) => {
      this.populateCatelog(data.books);
    });
  };

  getWithPhoto = () => {
    this.handleRequest("hasphoto", null, (data) => {
      this.populateCatelog(data.books);
    });
  };

  updateCart = (removeFlag, book) => {
    var newCart = this.state.cart;
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
    
    this.setState((state, props) => {
      return {
        cart: newCart
      };
    });

    console.log(this.state.cart);
  }

  cartCallback = () => {
    this.showModule('cart');
  }

  render() {
    return (
      <div className="App">
        <div className="sticky">
          <img src={logo} alt="Logo"/>
          
          <h2>Jan Wright</h2>
          <h3>17105 Nowthen Blvd., Anoka, MN 55303</h3>
          <h3>763-753-3429</h3>
          <hr/>
          <h3>Used, collectible, and out-of-print books -- good books -- for children and young people of all ages!</h3>
        </div>
        <div className="searchheading sticky top">
          <Search cartcount={this.state.cart.length} searchCallback={this.handleSearch} recentCallback={this.getRecent} hasPhotoCallback={this.getWithPhoto} categoriesCallBack={this.categoryCallBack} cartCallback={this.cartCallback} />
        </div>

        {this.state.loading && <div className="loader"><div className="dot-pulse"></div></div>}
        {this.state.showSuccess && <Success></Success>}
        {this.state.showCatalog && <Catalog books={this.state.books} cart={this.state.cart} changeCart={this.updateCart}></Catalog>}
        {this.state.showCategories && <Categories categories={this.state.categories} pickCallback={this.pickCategory}/>}
        {this.state.showCart && <Cart cart={this.state.cart} successCallback={() => this.showModule('success')} changeCart={this.updateCart}/>}
        <div className="footer sticky bottom">
          <hr/>
          <small><button className="about linklike">About Us</button> | <a href="mailto:bigt40@aol.com">email Jan</a> | <a href="mailto:jdhenckel@gmail.com">email webmaster</a></small>
          <hr/>
          <small>This way-cool web site developed by <a href="www.poorfox.com">poorfox</a>.</small>
        </div>
      </div>
    );
  }
}

export default App;
