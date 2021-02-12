import React, { Component, useEffect, useReducer } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import './gallery.css';

export default function Gallery() {
    const baseUrl="https://localhost:3000";
    
    const [images, setImages] = React.useState([]);
    const [loaded, setIsLoaded] = React.useState(false); 
    const [page, nextPage] = React.useState(1);    

    const onPageLoad = () => {
        
            fetch(`${baseUrl}/search?query=_page:${page}`,{
                method:'GET'
            })  
            .then((response)=> {
                (response.json().then((res) => {
                    setImages([...images, ...res.message]);
                    setIsLoaded(true);
                    nextPage(page + 1);                    
                }));
            })
        
        
    }
    React.useEffect(() => {
        onPageLoad();
    }, []);

    const onDelete = (id,i)=> {
        console.log(id);
        fetch(`${baseUrl}/delete/${id}`,{
            method: 'POST'
        })
        .then((res) => {
            res.json().then((result) => {
                console.log(result);
                let newImages=[...images];
                newImages.splice(i,1);
                setImages([...newImages]);
            })
        })
        .catch((err) => {
            console.log(err.json());
            alert("Failed to delete image");
        })
    }
    
      
        return (
            
            <div className="parentElement">
               <div className="image-view">
                <InfiniteScroll
                dataLength={images}
                next={() => {
                    onPageLoad();
                }}
                hasMore={true}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                    </p>
                }>
                    <div className="row">
                        <ul className="cards">
                    
                        {loaded ? (images || []).map( (upload,i) => {
                            return(
                            <li className="cards__item" key={i}>
                                <div className="card">
                                    <div className="card__image " style={{backgroundImage: `url(${baseUrl}/${upload.file240})` }}>
                                    </div>

                                    <div className="card__content">
                                        <div className="card__title">
                                            <span id={`name${i}`}>{ upload.name }</span>
                                        </div>
                                        <p className="card__text" id={`cardText${i}`}>
                                            <span className="date">{ upload.createdAt }</span>
                                            <br />
                                            <br />
                                            <span className="hashtag">{ upload.description }</span>
                                        </p>
                                    </div>
                                        <i className="fa fa-trash" aria-hidden="true" onClick={() => onDelete(upload.id,i)}></i>
                                </div>
                            </li>
                            )
                         }):""}
                         

                        </ul>
                        
                    </div>
                    </InfiniteScroll>
                </div>
            </div>
            );
    
}