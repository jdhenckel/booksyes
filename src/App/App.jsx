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
      books: [],
      categories: [],
      loading: false,
      showCatalog: false,
      showCategories: false,
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

  populateCatelog = (books) => {
    this.setState((state, props) => {
      return {
        showCatalog: true,
        showCategories: false,
        books: books,
      };
    });
  };

  categoryCallBack = () => {
    this.setState((state, props) => {
      return {
        showCatalog: false,
      };
    });

    if(this.state.categories.length !== 0) {
      this.setState((state, props) => {
        return {
          showCategories: true,
        };
      });

      return;
    }

    this.handleRequest("categories", null, (data) => {
      this.setState((state, props) => {
        return {
          showCategories: true,
          categories: data.categories,
        };
      });
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



  render() {
    return (
      <div className="App">
        <img src={logo} alt="Logo"/>
        
        <h2>Jan Wright</h2>
        <h3>17105 Nowthen Blvd., Anoka, MN 55303</h3>
        <h3>763-753-3429</h3>
        <hr/>
        <h3>Used, collectible, and out-of-print books -- good books -- for children and young people of all ages!</h3>
        <Search searchCallback={this.handleSearch} recentCallback={this.getRecent} hasPhotoCallback={this.getWithPhoto} categoriesCallBack={this.categoryCallBack}></Search>
        {this.state.loading && <div className="loader"><div className="dot-pulse"></div></div>}
        {this.state.showCatalog && <Catalog books={this.state.books}></Catalog>}
        {this.state.showCategories && <div className="categories">
          <ul>
            {this.state.categories.map((c, i) => (
              <li key={i}>
                <button onClick={() => this.pickCategory(c)}>{c}</button>
              </li>
            ))}
          </ul>
        </div>}
        <hr/>
        <small><button className="about linklike">About Us</button> | <a href="mailto:bigt40@aol.com">email Jan</a> | <a href="mailto:jdhenckel@gmail.com">email webmaster</a></small>
        <hr/>
        <small>This way-cool web site developed by <a href="www.poorfox.com">poorfox</a>.</small>
      </div>
    );
  }
}

export default App;
