import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import BookEntry from "./BookEntry";
import CartButton from "./CartButton";
import "./Catalog.css";

export default function Catalog(props) {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const cart = useState(props.cart ?? []);

    const {type, query} = useParams();


    useEffect(() => {
        var url = '';
        switch(type) {
            case 'category':
                url = `/.netlify/functions/bycategory?query=${query ?? ''}`
                break;
            case 'recent':
                url = '/.netlify/functions/new';
                break;
            case 'photos':
                url = '/.netlify/functions/hasphoto';
                break;
            case 'search':
                url = `/.netlify/functions/search?query=${query === '*' ? '' : query ?? ''}`
                break;
            default:
                return;
        }
        setLoading(true);
        
        // JOHN DIRTY HACK
        //axios.get(url)
        Promise.resolve({data:{"books":[
            
        {"id":0,"search":"aesop aesop’s fables  sterling children’s books 1988, 2010. hardcover with dust jacket. folio-size, more than 12”, with large, wonderful illustrations by charles santore. cm alveary. ambleside 1. 145490495x. not ex-lib. book and dust jacket fine, small tear in dust jacket; crease in fold-out page. .","isNew":"true","date added":"11/30/2021","author":"Aesop","title":"AESOP’S FABLES","price":"4","ISBN":"undefined","description":"Sterling Children’s Books 1988, 2010. Hardcover with dust jacket. Folio-size, more than 12”, with large, wonderful illustrations by Charles Santore. CM Alveary. Ambleside 1. 145490495X. NOT ex-lib. Book and dust jacket Fine, small tear in dust jacket; crease in fold-out page. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
    
        {"id":1,"search":"aesop the hare and the tortoise, retold and illustrated by helen ward 761309888 the millbrook press 1999. hardcover with dust jacket. . brand-new, tear in dust jacket. .","isNew":"true","date added":"11/30/2021","author":"Aesop","title":"THE HARE AND THE TORTOISE, Retold and illustrated by Helen Ward","price":"4.5","ISBN":"761309888","description":"The Millbrook Press 1999. Hardcover with dust jacket. . Brand-New, tear in dust jacket. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":2,"search":"aesop the aesop for children, with pictures by milo winter 1000005219 checkerboard press 1919, 1986. pictorial hardcover. full-page and ¼-page color ill. by winter. ambleside 1. scm. sonlight b, c. not ex-lib. fine. .","isNew":"true","date added":"11/30/2021","author":"Aesop","title":"THE AESOP FOR CHILDREN, With Pictures by Milo Winter","price":"5","ISBN":"1000005219","description":"Checkerboard Press 1919, 1986. Pictorial hardcover. Full-page and ¼-page color ill. by Winter. Ambleside 1. SCM. Sonlight B, C. NOT ex-lib. Fine. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":3,"search":"aesop the aesop for children, with pictures by milo winter  scholastic softcover 1919, 1994. full-page and ¼-page color ill. by winter. ambleside 1. scm. sonlight b, c. brand-new. .","isNew":"true","date added":"11/30/2021","author":"Aesop","title":"THE AESOP FOR CHILDREN, With Pictures by Milo Winter","price":"4","ISBN":"undefined","description":"Scholastic SOFTCOVER 1919, 1994. Full-page and ¼-page color ill. by Winter. Ambleside 1. SCM. Sonlight B, C. Brand-New. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":4,"search":"aesop the aesop for children, with pictures by milo winter  scholastic softcover 1919, 1994. full-page and ¼-page color ill. by winter. ambleside 1. scm. sonlight b, c. not ex-lib. very good. .","isNew":"true","date added":"11/30/2021","author":"Aesop","title":"THE AESOP FOR CHILDREN, With Pictures by Milo Winter","price":"3.5","ISBN":"undefined","description":"Scholastic SOFTCOVER 1919, 1994. Full-page and ¼-page color ill. by Winter. Ambleside 1. SCM. Sonlight B, C. NOT ex-lib. Very Good. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":5,"search":"aesop aesop’s fables, a classic illustrated edition 877017808 compiled by russell ash and bernard higton. chronicle books 1990. the finest aesop’s illustrations from the last 100 years have been gathered together - marvelous illustrations by arthur rackham, milo winter, edward detmold, lucy fitch perkins, randolph caldecott, others. ambleside 1. scm. . like-new, one tear in dust jacket. .","isNew":"true","date added":"11/30/2021","author":"Aesop","title":"AESOP’S FABLES, A Classic Illustrated Edition","price":"6.5","ISBN":"877017808","description":"Compiled by Russell Ash and Bernard Higton. Chronicle Books 1990. The finest Aesop’s illustrations from the last 100 years have been gathered together - marvelous illustrations by Arthur Rackham, Milo Winter, Edward Detmold, Lucy Fitch Perkins, Randolph Caldecott, others. Ambleside 1. SCM. . Like-New, one tear in dust jacket. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":6,"search":"alexander, martha nobody asked  if i wanted a baby sister  dial books 1971, 1977. hardcover. ill. by the author. good, library card pocket. .","isNew":"true","date added":"11/30/2021","author":"Alexander, Martha","title":"NOBODY ASKED  IF I WANTED A BABY SISTER","price":"4","ISBN":"undefined","description":"Dial Books 1971, 1977. Hardcover. Ill. by the author. Good, library card pocket. .","imageSrc":"DSC_8885,DSC_7507","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":7,"search":"andersen, hans christian the ugly duckling, retold and illustrated by troy howell 399221581 g p. putnam’s 1990. beautiful full-page color illustrations with five double-page spreads. ambleside 2. . not ex-lib. book and dust jacket fine. .","isNew":"true","date added":"11/30/2021","author":"Andersen, Hans Christian","title":"THE UGLY DUCKLING, Retold and illustrated by Troy Howell","price":"4","ISBN":"399221581","description":"G P. Putnam’s 1990. Beautiful full-page color illustrations with five double-page spreads. Ambleside 2. . NOT ex-lib. Book and dust jacket Fine. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":8,"search":"andersen, hans christian the little mermaid, illustrated by chihiro iwasaki 907234593 picture books studio 1967, 1984. adapted by anthea bell. ambleside 2. . not ex-lib. book and dust jacket very good, previous owner’s name. .","isNew":"true","date added":"11/30/2021","author":"Andersen, Hans Christian","title":"THE LITTLE MERMAID, illustrated by Chihiro Iwasaki","price":"4.5","ISBN":"907234593","description":"Picture Books Studio 1967, 1984. Adapted by Anthea Bell. Ambleside 2. . NOT ex-lib. Book and dust jacket Very Good, previous owner’s name. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":9,"search":"anglund, joan walsh the joan walsh anglund story book  random house 1978. hardcover with dust jacket. ill. anglund. cute little 2-4 page stories with anglund’s little chubby cheeked children. not ex-lib. book very good; dust jacket has short tears and a chip. ,6238 .","isNew":"true","date added":"11/30/2021","author":"Anglund, Joan Walsh","title":"THE JOAN WALSH ANGLUND STORY BOOK","price":"4.5","ISBN":"undefined","description":"Random House 1978. Hardcover with dust jacket. Ill. Anglund. Cute little 2-4 page stories with Anglund’s little chubby cheeked children. NOT ex-lib. Book Very Good; dust jacket has short tears and a chip. ,6238 .","imageSrc":"DSC_6237","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":10,"search":"anno, mitsumasa anno’s aesop, a book of fables by aesop and mr fox, retold and illustrated by anno  orchard books 1989, first edition. hardcover with dust jacket. classic version of aesop’s fables as well as new tales that clever mr. fox “reads” to his son. richly detailed pictures delightfully illustrate both stories. 62 pp. library card pocket. book and dust jacket near-fine. .","isNew":"true","date added":"11/30/2021","author":"Anno, Mitsumasa","title":"ANNO’S AESOP, A Book of Fables by Aesop and Mr Fox, retold and illustrated by Anno","price":"8","ISBN":"undefined","description":"Orchard Books 1989, first edition. Hardcover with dust jacket. Classic version of Aesop’s fables as well as new tales that clever Mr. Fox “reads” to his son. Richly detailed pictures delightfully illustrate both stories. 62 pp. Library card pocket. Book and dust jacket Near-Fine. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":11,"search":"anno, mitsumasa anno’s flea market 399210318 philomel 1984, first u. s. edition. first published in japanese in 1983. hardcover with dust jacket. . ex-lib. book good; dust jacket very good. .","isNew":"true","date added":"11/30/2021","author":"Anno, Mitsumasa","title":"ANNO’S FLEA MARKET","price":"3.5","ISBN":"399210318","description":"Philomel 1984, first U. S. edition. First published in Japanese in 1983. Hardcover with dust jacket. . Ex-lib. Book Good; dust jacket Very Good. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":12,"search":"barker, cicely mary flower fairies of the spring 723237530 frederick warne 1923, 2018. hardcover with dust jacket. ill. by barker. . brand-new. .","isNew":"true","date added":"11/30/2021","author":"Barker, Cicely Mary","title":"FLOWER FAIRIES OF THE SPRING","price":"5","ISBN":"723237530","description":"Frederick Warne 1923, 2018. Hardcover with dust jacket. Ill. by Barker. . Brand-New. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":13,"search":"barklem, jill the complete brambly hedge harpercollins 1999, 2011 7450168 hardcover with dust jacket. includes ill. by barklem. . book and dust jacket very good. .","isNew":"true","date added":"11/30/2021","author":"Barklem, Jill","title":"THE COMPLETE BRAMBLY HEDGE HarperCollins 1999, 2011","price":"10","ISBN":"7450168","description":"Hardcover with dust jacket. Includes Ill. by Barklem. . Book and dust jacket Very Good. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":14,"search":"barklem, jill the secret staircase 689830904 brambly hedge. atheneum 1983, 1999 first u. s. edition. hardcover. . like-new. .","isNew":"true","date added":"11/30/2021","author":"Barklem, Jill","title":"THE SECRET STAIRCASE","price":"5","ISBN":"689830904","description":"Brambly Hedge. Atheneum 1983, 1999 first U. S. edition. Hardcover. . Like-New. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"},
        
        {"id":15,"search":"barklem, jill sea story, primrose and wilfred sail to sandy bay 6645984 great britain: 1990, 1996. ill. by barklem. . brand-new. .","isNew":"true","date added":"11/30/2021","author":"Barklem, Jill","title":"SEA STORY, Primrose and Wilfred Sail to Sandy Bay","price":"5","ISBN":"6645984","description":"Great Britain: 1990, 1996. Ill. by Barklem. . Brand-New. .","imageSrc":"undefined","category":"PICTURE BOOKS - FICTION","category Literal":"PICTURE BOOKS – FICTION","category ID":"1"}]}})
        .then(res => {
            console.log('RESPONSE = ',res);
            handleResponse(res);
        }).finally(() => {
            setLoading(false);
        });
    }, [type, query]);

    const handleResponse = (res) => {
        setBooks(res.data.books);
    }

    const changeCart = (removeFlag, book) => {
        props.changeCart(removeFlag, book);
    }

    const inCart = (book) => {
        return cart.some(e => e.search === book.search);
    }

    return(
        <div className="catalog">
            <Spinner loading={loading} >
                {(books === undefined || books.length === 0) && <h3>This query returned no results.</h3>}
                
                {books.map((b, index) => (
                    <div key={index} className={index % 2 === 0 ? "bookContainer even" : "bookContainer odd"}>
                        <CartButton inCart={inCart(b)} clickCallback={(action) => changeCart(action, b)} />
                        <BookEntry book={b}></BookEntry>
                    </div>
                ))}
            </Spinner>
        </div>
    );
}