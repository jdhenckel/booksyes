import React, { Component } from 'react';
import axios from 'axios';
import Catalog from '../Catalog/Catalog';
import Search from '../Search/Search';
import './App.css';
import logo from './booksyes.jpg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCatalog: false,
      books: []
    }
  }

  handleSearch = (searchData) => {
    //todo seach
    console.log("app got the search data: " + searchData);
    var url = "/.netlify/functions/search";
    axios.get(url, {
      params: {
        query: searchData.toString()
      }
    }).then(response => {
      console.log(response.data);
      this.setState((state, props) => {
        return {
          books: response.data.books,
          showCatalog: true,
        };
      });
      //get data and fill catalog
    });
  };

  render() {
    return (
      <div className="App">
        <img src={logo} />
        
        <h2>Jan Wright</h2>
        <h3>17105 Nowthen Blvd., Anoka, MN 55303</h3>
        <h3>763-753-3429</h3>
        <hr/>
        <h3>Used, collectible, and out-of-print books -- good books -- for children and young people of all ages!</h3>        
        <Search searchCallback = {this.handleSearch}></Search>
        {this.state.showCatalog && <Catalog books={this.state.books}></Catalog>}
        <hr/>
        <small><a className="about" href="">About Us</a> | <a href="mailto:bigt40@aol.com">email Jan</a> | <a href="mailto:jdhenckel@gmail.com">email webmaster</a></small>
        <hr/>
        <small>This way-cool web site developed by <a href="www.poorfox.com">poorfox</a>.</small>
      </div>
    );
  }
}

export default App;
