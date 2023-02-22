const tf = require('@tensorflow/tfjs');
const fs = require('fs');

// Prepare the data
const data = fs.readFileSync('data.json');
const inputs = data.input;
const outputs = data.output;

// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.dense({units: 32, inputShape: [inputs.length]}));
model.add(tf.layers.dense({units: outputs.length, activation: 'softmax'}));

// Compile the model
model.compile({optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy']});

// Train the model
model.fit(inputs, outputs, {epochs: 10}).then(() => {
    console.log('Model training complete.');

    
    // const results = model.evaluate(testInputs, testOutputs);
    // console.log(`Accuracy: ${results[1]}`);

    // Save the model
    model.save('file://model').then(() => {
        console.log('Model saved.');
    });
});
