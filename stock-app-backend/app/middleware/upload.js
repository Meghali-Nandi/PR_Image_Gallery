const multer = require("multer");
const sharp = require("sharp");
const gm = require('gm');
var im = require('imagemagick');
resolve = require('path').resolve
const mkdirp = require('mkdirp');


const multerStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: imageFilter
});

const resizeImages240 = async(file, fileName) => {
    await mkdirp('resources/file240');
    console.log(Buffer.from(file.data));
    const image = sharp(Buffer.from(file.data));
    const aspectRatio = Math.round((await image.metadata()).width / (await image.metadata()).height);

    return await image
        .resize((await image.metadata()).height * aspectRatio, 720)
        .jpeg({ quality: 90 })
        .toFile(`resources/file240/${fileName}`)
        .then(result => {
            return `${fileName}`;
        });
};
const resizeImages720 = async(file, fileName) => {
    await mkdirp('resources/file720');
    const image = sharp(Buffer.from(file.data));
    const aspectRatio = Math.round((await image.metadata()).width / (await image.metadata()).height);
    return await image
        .resize((await image.metadata()).height * aspectRatio, 720)
        .jpeg({ quality: 90 })
        .toFile(`resources/file720/${fileName}`)
        .then(result => {
            return `${fileName}`;
        });
};

const fetchAdditionalTags = async() => {
    const dummyTags = ["Interiors", "Wallpapers", "Experimental", "People", "Textures", "Food", "Spirituality", "Wellness", "Nature", "Events", "Culture", "Architecture", "Technology", "Athletics", "Work", "History", "Film", "Animals", "Travel", "Fashion"]
    let fetchedTags = [];

    for (let i = 0; i <= 2; i++) {
        var item = dummyTags[Math.floor(Math.random() * dummyTags.length)];
        fetchedTags.push(item.toLowerCase());
    }

    return fetchedTags;
}

const fetchAdditionalTagsSetInterval = async() => {
    const tags = await fetchAdditionalTags();
    return new Promise((res, rej) => {
        const timeOut = setTimeout(() => {
            res(tags);
            clearTimeout(timeOut);
        }, 5000);
    });
}

function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}


module.exports = {
    upload,
    resizeImages240,
    resizeImages720,
    fetchAdditionalTagsSetInterval

}