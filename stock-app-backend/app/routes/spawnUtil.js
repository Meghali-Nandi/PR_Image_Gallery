const { spawn } = require("child_process");

const spawnChild = (data) => {

    const cpImage = spawn("node", [__dirname + '/upload-worker-thread.js'], {
        detached: true,
        stdio: ['ipc']
    });

    cpImage.stdout.on('data', data => {
        console.log(`stdout:\n${data}`);
    });

    cpImage.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
    });

    // cpImage.on('spawn', () => {
    //     console.log("Child process spawned");
    cpImage.send(data);

    // })

    return new Promise((res, rej) => {
        cpImage.on('message', (code) => {
            console.log(code);
            res(code);
        });
    });



}
module.exports = spawnChild;
// (async() => { await spawnChild("test", "test") })()