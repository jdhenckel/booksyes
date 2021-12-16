import React, {useState, useEffect} from 'react';
import './Spinner.css';

export default function(props) {
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(props.loading);
    }, [props]);

    if(loading) {
        return <div className='spinner'><div className='dot-pulse'></div></div>
    }

    return props.children ?? null;
}