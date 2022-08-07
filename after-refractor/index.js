
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));
const { fetch, saveFile, measurePerformance } = require('./utils');
const { performance } = require('perf_hooks');

const {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'Pink',
    size = 100,
} = argv;

try {
    const startTime = performance.now()

    // batching external APIs which are not depend on each others for improving performance
    const jobs = [];

    jobs.push(fetch({ url: greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size }));
    jobs.push(fetch({ url: who + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size }));

    // catch all response 
    Promise.all(jobs).then((response) => {
        blend([{
            buffer: new Buffer(response[0].data, 'binary'),
            x: 0,
            y: 0,
        }, {
            buffer: new Buffer(response[1].data, 'binary'),
            x: width,
            y: 0,
        }], {
            width: width * 2,
            height: height,
            format: 'jpeg',
        }, async (err, data) => {
            if (err) {
                console.log(`ERROR: ${err}`);
                return;
            }

            // save as a new file after blend images
            const response = await saveFile({ filename: 'cat-card.jpg', file: data });

            if (response.success) {
                console.log("The file was saved!");
            } else {
                console.log(response.data);
            }

            const endTime = performance.now();
            console.log("===========================");
            console.log(`Execution took: ${measurePerformance({ startTime, endTime })}`);
            console.log("===========================");
        });
    });
} catch (error) {
    console.log("===========================");
    console.log(`Error: ${error}`);
    console.log("===========================");
}
