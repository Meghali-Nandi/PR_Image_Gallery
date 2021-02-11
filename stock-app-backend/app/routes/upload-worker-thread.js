const uploadImage = require("../middleware/upload");
const fs = require("fs");
// const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
// const workerpool = require('workerpool');


console.log("Worker thread spawned");
uploadProcess = async({ file240, file720, reqFile }) => {
    try {
        console.log("request came to worker : " + file240);
        await uploadImage.resizeImages240(reqFile, file240);
        await uploadImage.resizeImages720(reqFile, file720);

        process.stdout.write(`Image processed for ${file240}`);
        process.send({ code: 1 });
    } catch (err) {
        console.log(err);
        process.send({ code: 0 });

    };

}

function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

process.on('message', async(data) => {

    await uploadProcess(data);
    process.exit();
});


// workerpool.worker({
//     upload: uploadProcess
// })