const fs = require('fs');
const path = require('path');

const getFiles = async (dir) => {
    const htmlFiles = [];
    const jsFiles = [];
    const cssFiles = [];

    const files = await fs.promises.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
            const { htmlFiles: html, jsFiles: js, cssFiles: css } = await getFiles(filePath);
            htmlFiles.push(...html);
            jsFiles.push(...js);
            cssFiles.push(...css);
        } else if (path.extname(file) === '.html') {
            htmlFiles.push(filePath);
        } else if (path.extname(file) === '.js') {
            jsFiles.push(filePath);
        } else if (path.extname(file) === '.css') {
            cssFiles.push(filePath);
        }
    }
    return { htmlFiles, jsFiles, cssFiles };
};

const main = async () => {
    try {
        const filePath = path.join(__dirname, 'public-folders-1676757109039.json');
        const parentPaths = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
        const allFiles = {};
        for (const parentPath of parentPaths) {
            const { htmlFiles, jsFiles, cssFiles } = await getFiles(parentPath);
            allFiles[parentPath] = { htmlFiles, jsFiles, cssFiles };
        }
        const outputFilePath = path.join(__dirname, `all-files-${Date.now()}.json`);
        fs.promises.writeFile(outputFilePath, JSON.stringify(allFiles, null, 2), 'utf-8');
        console.log(`Output written to ${outputFilePath}`);
    } catch (error) {
        console.error(error);
    }
};

main();
