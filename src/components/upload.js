import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import './upload.css';
import './dropZone.css';

export default class Upload extends Component {
    baseUrl="https://localhost:3000";
    fileObj =[];
    fileArray=[];
    allowedExtensions = ['jpg' , 'png' , 'svg']
    uploadImages = [];
    afterUploadMessage = "NOTE: Images of size less than 500 would be rejected !!!";
    constructor(props){
        super(props)
        this.state = {
            image: [],
            uploading: false           
        }
       
        
    }
    
    
  validateFiles = async function*(files) {
    for(let i = 0; i< files.length ; i++){
      
      let fileName = files.item(i).name.split(".");
      
      if(fileName[0]){
        let image = new Image();
        let url = URL.createObjectURL(files.item(i));
        image.src = url;

        let validImage = await new Promise((res) => {
          image.onload = () => {
            let shortEdge = Math.min(image.width, image.height);
            if(shortEdge >= 500){
              res({
                file: files.item(i),
                name: fileName[0],
                description: "",
                url: url
              });
            }
            else{
              res(undefined);
              this.afterUploadMessage = "Some images are less than 500px. Ignoring them !!"
            }
          }
        });
        yield validImage;
        
      }
    }
  }

  handleClick = (e) => {
    this.inputElement.click();
  }

  

  filesButton = async(event) => {
    this.afterUploadMessage = "NOTE: Images of size less than 500 would be rejected !!!";
    let images = event.target.files;
    let image = this.validateFiles(images);
    for await(let file of image){
      if(file !== undefined){
        this.uploadImages.push(file);
      }      
    }
    this.setState({
        image: this.uploadImages
        
    })
    //  console.log(this.uploadImages);
    console.log(this.state);
  }
  

  checkValidName() {
    let valid = true;
    this.uploadImages.forEach(image => {
      if(!image.name){
        valid = false; 
        return valid;
      } 
            
    });
    return valid;
  }
  async uploadClick(){
    let status = true;
    if(this.uploadImages.length==0) return;
    if(!this.checkValidName) return;
    let val = await this.uploadImagesFunc(this.state.image)
    val.forEach((v) => {
        if(v !== 200){
          status = false;
        }
      })
      if (status) {
        this.afterUploadMessage= "Images uploaded successfully";
    }
      else {
        this.afterUploadMessage = "Failed to upload one or more images !!";
      }
    
    
    this.uploadImages=[];
    this.setState({
        image: this.uploadImages
    })

    
  }

  uploadImagesFunc=async (images) => {
    let responses=[];
    this.setState({
      uploading: true
    });
    await Promise.all(
        
        images.map(async (file) => {
            let formData = new FormData;
            formData.append('file',file.file);
            formData.append('name', file.name);
            formData.append('description', file.description);
            console.log("sending form data");
            let response = await fetch(this.baseUrl+'/upload',{
                method:'POST',
                body: formData
            })
            responses.push(response.status);

        })
    )
    this.setState({
      uploading: false
    })
    return responses;    
  }

  
    dragOver = (e) => {
      e.preventDefault();
    }

    dragEnter = (e) => {
      e.preventDefault();
    }

    dragLeave = (e) => {
      e.preventDefault();
    }

    fileDrop = async(e) => {
      e.preventDefault();
      const images = e.dataTransfer.files;
      let image = this.validateFiles(images);
      for await(let file of image){
        if(file !== undefined){
          this.uploadImages.push(file);
        }      
      }
      this.setState({
          image: this.uploadImages
          
      })
    }
    render() {
        
        return (

            <div className="container">
              

            <h1> UPLOAD FILES</h1>
            <div className="button-container" style={{display:"none"}}>
                <div className="hover">
                    

                    <div className="fileUpload btns btn-secondary">
                        <a className="social-link" onClick={this.handleClick}>
                            <i className="fa fa-image"></i>
                        </a>
                        <input className="upload" id="files" name="files" type="file" accept="image/*" multiple onChange={event => this.filesButton(event)}
                        ref={input => this.inputElement = input}  />
                    </div>
                </div>

            </div>
              <div className="DZcontainer" onClick={this.handleClick}>
                  <div className="drop-container"
                  onDragOver={this.dragOver}
                  onDragEnter={this.dragEnter}
                  onDragLeave={this.dragLeave}
                  onDrop={this.fileDrop}
                  >
                  <div className="drop-message" >
                      <div className="upload-icon"></div>
                          Drag & Drop files here or click to upload
                  </div>
              </div>
            </div>
            <div className="alert-message-container">
                <span className="alert-message">{ this.afterUploadMessage }</span>
            </div>
            {(!this.state.uploading) ? 
              (<div className="upload-container">
                  <div className="vertical-center">
                      <button className="btn draw-border"  onClick={() => this.uploadClick()}>Upload</button>
                  </div>
              </div>):

                (<Loader className="loader"
                type="Puff"
                color="#00BFFF"
                height={50}
                width={50}


                />)
            }
            

            <div className="image-view">

                <ul className="cards">
                    
                    {(this.uploadImages || []).map( (upload,i) => {
                        return (
                        <li className="cards__item" key={i} >
                        <div className="card">
                            <div className="card__image " style={{backgroundImage: `url(${upload.url})` }}></div>
                            <div className="card__content">
                                <div className="card__title">
                                    <input id={`name${i}`} name="name{i}" type="text" defaultValue={upload.name} onChange={(e) => {
                                        this.state.image[i].name = e.target.value;
                                        this.forceUpdate()
                                    }}/>
                                </div>
                                
                                {(upload.name.length===0) ? (<span className="warning-text">
                                    Image name empty
                                </span>): null}
                                <div className="card__title">
                                    <input id={`description${i}`} name="description{i}" type="text" placeholder="#description " onChange={(e) => {
                                        this.state.image[i].description = e.target.value;
                                        this.forceUpdate()
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </li>
                    )
                    })}
                    
                </ul>
            </div>

        </div>
                );
    }
}