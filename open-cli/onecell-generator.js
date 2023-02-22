const fs = require('fs');

(async () => {
    const json = [];
    try {
        const file = JSON.parse(await fs.promises.readFile('./all-files-1676757267647.json', 'utf-8'));
        console.log(file);
        for (const files in file) {
            json.push(file[files]);
        }

        // console.log(json);
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        return;
    }

    async function extractcode(paths) {
        let code = '';
        return await Promise.all(paths.map(async (path) => {
            try {
                return code = await fs.promises.readFile(path, 'utf-8');
            } catch (err) {
                console.error(`Error reading file ${path}: ${err.message}`);
            }
        }));
    }

    const extract = async (files) => {
        const promises = Object.entries(files).map(async ([fileType, filePaths]) => {
            let code = '';
            try {
                code = await extractcode(filePaths);
            } catch (err) {
                console.error(`Error extracting code: ${err.message}`);
            }
            return { [fileType]: code };
        });

        const extractedCode = await Promise.all(promises);
        const extractedCodeObject = extractedCode.reduce((acc, cur) => ({ ...acc, ...cur }), {});
        return extractedCodeObject;
    };



    async function run() {
        return json.map(async (dir) => {

            for (const filecode in dir) {
                dir[filecode] = await extractcode(dir[filecode])
            }

            return dir;
        });
    }

    const extractedCode = await run();
    const finalcode = JSON.stringify(await Promise.all(extractedCode));
    fs.writeFileSync(`${Date.now()}.json`, finalcode);


    // assign input and output keys
    function generatekeys() {


        const jsonArray = JSON.parse(finalcode);


        const categories = ["portfolio", "commercial", "bootstrap", "professional", "neutral"];

        for (let i = 0; i < jsonArray.length; i++) {
            let randomCategory = categories[Math.floor(Math.random() * categories.length)];
            jsonArray[i].input = randomCategory;

            let output = [0, 0, 0, 0, 0];
            let randomIndex = Math.floor(Math.random() * output.length);
            output[randomIndex] = 1;

            jsonArray[i].output = output;
        }

        // console.log(jsonArray);

        return jsonArray;
    }

    const genkeys = generatekeys();

    fs.writeFileSync(`aimodel-${Date.now().toLocaleString()}.json`, JSON.stringify(genkeys));




})();
