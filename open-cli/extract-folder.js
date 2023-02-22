const fs = require('fs');
const path = require('path');

const inputDirectory = process.argv[2];
const publicFolders = [];

// Read all files in the input directory and its subdirectories
async function readDirectory(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, async (error, filesInDirectory) => {
            if (error) {
                reject(error);
                return;
            }

            for (const file of filesInDirectory) {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    // if (file === "public") {
                        publicFolders.push(filePath);
                    // } else {
                        await readDirectory(filePath);
                    // }
                }
            }
            resolve();
        });
    });
}

const main = async () => {
    try {
        const filePath = path.join(__dirname, `public-folders-${Date.now()}.json`);
        await readDirectory(inputDirectory);
        console.log(`The public folder paths are: ${publicFolders}`);
        fs.writeFileSync(filePath, JSON.stringify(publicFolders));
    } catch (error) {
        console.error(error);
    }
};

// Start the script
main();
