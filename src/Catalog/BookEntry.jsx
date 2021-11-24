import React, { Component } from "react";

class BookEntry extends Component {
    constructor(props) {
        super (props);
        this.state = {
            book: props.book ?? {},
        }
    }

    render() {
        return(
            <div className="bookentry">
                {this.state.book.title}
            </div>
        );
    }
}

export default BookEntry;