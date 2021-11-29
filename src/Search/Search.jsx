import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            books: [{title: "peter pan"}, {title: "The moon is a harsh mistress"}]
        }
    }

    searchFor = (e) => {
        e.preventDefault();
        console.log('You searched for: ' + this.state.searchTerm);
        this.props.searchCallback(this.state.searchTerm);
    }

    browseCategories = (e) => {
        e.preventDefault();
        console.log('You clicked categories.');
    }

    searchRecent = (e) => {
        e.preventDefault();
        console.log('You clicked recent.');
    }

    searchPhoto = (e) => {
        e.preventDefault();
        console.log('You clicked photos.');
    }

    onChange = (e) => {
        this.setState({searchTerm: e.target.value});
    }

    render() {
        return (
            <div>
                <div className="search">
                    <div>
                        <input type="text" className="field" placeholder="Search for" onChange={this.onChange} value={this.state.searchTerm}></input>
                        <button className="gobutton" onClick={this.searchFor}></button>
                    </div>
                    <button className="category" onClick={this.browseCategories}>Browse By Category</button>
                    <small className="specialsearch"><a href="" onClick={this.searchRecent}>Find Recent Additions</a> <a href="" onClick={this.searchPhoto}>Find Books with a Photo</a></small>
                    <small className="infotext">To search the catalog for a word or phrase, type it in the Search field and click on the GO! button.
    To view the entire catalog, leave the Search field blank. To load the entire catalog takes about five minutes if you are using a slow connection.
    To browse the catalog one section at a time, click the Browse by category button.</small>
                </div>
            </div>
        );
    }
}

export default Search;