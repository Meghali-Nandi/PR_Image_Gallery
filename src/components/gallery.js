import React, { Component, useEffect, useReducer } from "react";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import InfiniteScroll from 'react-infinite-scroll-component';
import './gallery.css';

export default function Gallery() {
    const baseUrl="https://localhost:8080";
    
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

    const onDelete = (id,i,name)=> {
        fetch(`${baseUrl}/delete/${id}`,{
            method: 'POST'
        })
        .then((res) => {
            res.json().then((result) => {
                let newImages=[...images];
                newImages.splice(i,1);
                setImages([...newImages]);
                ToastsStore.success(`Image ${name} deleted successfully`);

            })
        })
        .catch((err) => {
            console.log(err.json());
            alert("Failed to delete image");
        })
    }

    window.onscroll = (e) => {
        // print "false" if direction is down and "true" if up
        console.log(this.oldScroll > this.scrollY);
        this.oldScroll = this.scrollY;
      }
    
      
        return (
            
            <div className="parentElement">
                <ToastsContainer className="toast" store={ToastsStore}/>
               <div className="image-view">
                <InfiniteScroll
                dataLength={images}
                next={() => {
                    onPageLoad();
                }}
                hasMore={true}
                >
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
                                        <i className="fa fa-trash" aria-hidden="true" onClick={() => onDelete(upload.id,i, upload.name)}></i>
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