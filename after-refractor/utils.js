const { writeFile } = require('fs');
const { join } = require('path');
const request = require('request');

/**
 * handle file save
 * @param { filename: string } 
 * @return Promise
 */
const saveFile = ({ filename, file }) => {
    return new Promise((resolve) => {
        try {
            const path = join(process.cwd(), `/after-refractor/${filename}`);

            writeFile(path, file, 'binary', (error) => {
                if (error) {
                    resolve({
                        success: false,
                        message: "File couldn't save.",
                        data: {
                            error
                        }
                    });
                }

                resolve({
                    success: true,
                    message: "File has been saved!",
                    data: {
                        path
                    }
                });
            });
        } catch (error) {
            resolve({
                success: false,
                message: "File couldn't save.",
                data: {
                    error
                }
            });
        }
    });
}

/**
 * handle fetch APIs
 * @param { url: string } 
 * @returns 
 */
const fetch = ({ url }) => {
    const basedURL = 'https://cataas.com/cat/says/';

    return new Promise(resolve => {
        request.get({
            url: basedURL + url,
            encoding: 'binary'
        }, (err, res, body) => {
            if (err) {
                resolve({
                    success: false,
                    message: 'something went wrong!',
                    data: error
                });
            }

            resolve({
                success: true,
                message: 'successfully fetched!',
                data: body
            });
        });
    });
}

/**
 * handle performance measure
 * @param { startTime: number, endTime: number } 
 * @returns 
 */
const measurePerformance = ({ startTime, endTime }) => {
    return `${Number((endTime - startTime) / 1000).toFixed(4)}s`;
}

module.exports = {
    saveFile,
    fetch,
    measurePerformance
};