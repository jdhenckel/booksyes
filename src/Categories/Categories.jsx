import React, {Component} from "react";
import './Categories.css';

export default class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: props.categories ?? [],
        }
    }

    pickCategory = (category) => {
        this.props.pickCallback(category);
    }

    render = () =>
    <div className="categories">
        {this.state.categoryList.map((c, index) => (
            <button className={index % 2 === 0 ? "even" : "odd"} key={index} onClick={() => this.pickCategory(c)}>{c}</button>
            ))}
    </div>
}