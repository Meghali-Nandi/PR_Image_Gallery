# PR_Image_Gallery
It is an application in which a user can upload images and then view them in gallery.

### Pre- requisites
- Nodejs v12+
- MySQL (with a database named "pr_image")
 

### Features
- Front-end using React JS 
    - To upload multiple images with name and description (inclusing tags).
- Back-end using Node.JS and MySQL
    - Usage of cluster mode and child processes to handle multiple requests to upload and serve images to and from MySQL

### Build
```sh
$ cd PR_Image_Gallery
$ npm install
$ npm run build
```
```sh
$ cd PR_Image_gallery/stock-app-backend
$ npm install
```

### Deployment
```sh
$ cd stock-app-backend
$ npm start
```
The application is enabled with HTTPS. Thus, a pem file and certificate needs to be generated and included in the  `server.js` file.

### Essential Libraries involved
[Sequelize](https://sequelize.org/) - Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading. In this project, I have used MySQL and Sequelize helps in transactions in database with least number of code and headache.

[Sharp](https://www.npmjs.com/package/sharp) - The typical use case for this high speed Node.js module is to convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP and AVIF images of varying dimensions. In this project, processing of the image files into dimension of 240px and 720px are done parallelly using this module. 

[Multer](https://www.npmjs.com/package/multer) - Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.In this project, as well, multer came in handy to receive images as multipart data.

[Sanitize](https://www.npmjs.com/package/sanitize) - This library is for the purpose of sanitizing user input. In this project, this library is used to protect the server from invalid inputs from user side or any kind of attack.

### Use-case Overview
On loading the index page, the user will be able to login to the application with the following credentials- admin/admin@1234.

The application server is for two APIs - 
* `/upload` - which is for uploading multiple images or a directory of images
The user has two options to upload image files - multiple images via drag and drop or by clicking. The image dimension should be greater than `500 px` else the images are not loaded. The name of the image is mandatory. For better user experience, it is default to the name of the image as stored in the local file system. The user is allowed to change the name and add description inclusing hashtags which should be space seperated. For e.g. "#people #travel #traveldiaries". On clicking the upload button, the upload API is triggered. 
The Node server uses the child process to distribute the multiple requests for image processing. Before triggering the child processes, the input from the client is validated using the [Sanitize]() library against any kind of attack. Then the image file is passed to the workers to process and return image locations of image files of dimensions - 240px and 720px. The image processing is done with the help of [Sharp](). Sharp can process the images and return in two ways - as a buffer or store into file system. As I have used MySQL to store the uploaded data and storing file blobs / buffers in the table is a not effective, thus I have chosen to store the images in the file system. As we do not have an API to delete the records, thus it is obvious that the storage should be large enough to store the multiple images. As a future scope, we can procure to store the images to S3 buckets.
The database calls are not done by the workers as there can be resource crunch for multiple database calls. Moreover, as database calls are networks calls which are already multi-threaded, thus there is no requirement to offload.
After each processing of the uploaded image, response is sent to the client of either success or failure.
Meanwhile, a loader greets the user until the client gets the response of all the images processes. 


* `/gallery`- to search for images from the gallery via queries. 
On loading the gallery page, the user would be able to checkout the last 30 uploaded images. There is a infinite scroll which can be used for lazy loading of the images. 
On load and on infinite scroll, the Node.js server triggers Sequelize to fetch the records. Sequelize can form own queries to fetch the records, but I have used raw queries for Sequelize to fetch the records in order to implement combination of queries. Building MySQL queries seemed easier and faster than asking Sequelize to form queries based on multiple `includes` hell. On fetching the records with an offset of 30, the client is served with the records. The following information is returned by the server -
        * ID of the image
        * Image file location of 240px. (for faster loading).
        * Image name
        * Image description
        * Uploaded date and time of the image

### Key properties
1. Resilient 

While uploading of images, multiple child processes handle the processing of the images. Thus, if the processing of an image would crash, it will not affect the processing of other images as the child processes work independently. Moreover, even if one request fails, the other requests are handled parallelly. Another faeture is of the use of child processes which are run in detached mode to the main application. This is to ensure that even if the main server would crash, the processing of the images goes on. The use of cluster mode also helps in load balancing the requests. Thus, even if one thread of the main application would crash, only one request would fail. The rest of the images would still continue processing. 

2. Perfomant 

With usage of multiple child processes, the processing of images is done parallely which reduces the time of execution as compared to synchronous processing. 
With lazy loading feature of image gallery, the user will not have to wait long for their desired beautiful images. 
Moreover, until a user searches for specific hashtags, Sequelize will only query the `images` table based on the search query. For this reason, the hashtags are also stored as concatenated strings in the `images` model.

3. Extensible

Every module and every component is written following low coupling mechanism such that if there is any change in any environment variable or static information, they can be changed in the respostive config files - be it database or application configurations.

4. Secured

The Node.js server is secured with HTTPS deployment. Also, with the use of Sanitize library, the user inputs are sanitized before processing. This reduces the chances of unwanted attacks. 

### Final thoughts
There are multiple areas where improvements can be done. 
- Currently, the images are stored in the disk after processing. The processed images can be shifted to S3 buckets from where the client can load the images. 
- Initialization of the child processes takes few seconds before starting. 
