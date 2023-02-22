const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

(async () => {
    // Read the input and output files
    const input = JSON.parse(await fs.promises.readFile('./aimodel-1,675,901,279,450.json', 'utf8'));
    const output = JSON.parse(await fs.promises.readFile('./aimodel-1,676,757,637,018.json', 'utf8'));

    const categories = ["portfolio", "commercial", "bootstrap", "professional", "neutral"];

    function preprocessInputData(input) {
        const inputs = [];
        const javascripts = [];
        const csss = [];
        const htmls = [];

        input.forEach(entry => {
            const inputIndex = categories.indexOf(entry.input);
            const inputOneHot = tf.oneHot(tf.tensor1d([inputIndex], 'int32'), categories.length).flatten();
            inputs.push(inputOneHot);

            javascripts.push(entry.javascript);
            csss.push(entry.css);
            htmls.push(entry.html);
        });

        return {
            inputTensor: tf.stack(inputs),
            javascriptTensor: tf.stack(javascripts),
            cssTensor: tf.stack(csss),
            htmlTensor: tf.stack(htmls)
        };
    }

    function preprocessOutputData(output) {
        const outputs = [];
        const javascripts = [];
        const csss = [];
        const htmls = [];

        output.forEach(entry => {
            const outputIndex = categories.indexOf(entry.input);
            const outputOneHot = tf.oneHot(tf.tensor1d([outputIndex], 'int32'), categories.length).flatten();
            outputs.push(outputOneHot);

            javascripts.push(entry.javascript);
            csss.push(entry.css);
            htmls.push(entry.html);
        });

        return {
            outputTensor: tf.stack(outputs),
            javascriptTensor: tf.stack(javascripts),
            cssTensor: tf.stack(csss),
            htmlTensor: tf.stack(htmls)
        };
    }

    const processedInputData = preprocessInputData(input);
    const processedOutputData = preprocessOutputData(output);

    // Concatenate the input and output tensors along the second dimension
    const inputData = tf.concat([processedInputData.inputTensor, processedInputData.javascriptTensor, processedInputData.cssTensor, processedInputData.htmlTensor], 1);
    const outputData = tf.concat([processedOutputData.outputTensor, processedOutputData.javascriptTensor, processedOutputData.cssTensor, processedOutputData.htmlTensor], 1);

    // Define the model architecture and compile it
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [inputData.shape[1]] }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 5, activation: 'softmax' }));
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    async function trainModel() {
        const history = await model.fit(inputData, outputData, {
            epochs: 10,
            batchSize: 32
        });

        console.log(history.history.loss[0]);

        // Save the model to disk
        await model.save(`file://${path.join(__dirname, `./model-${Date.now()}`)}`);
    }

    trainModel();

})();
