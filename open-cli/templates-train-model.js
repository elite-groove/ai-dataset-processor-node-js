const readline = require("readline");
const glob = require("glob");
const fs = require("fs-extra");
const program = require("commander");

async function scanDirectory(dirPath) {
  dirPath = dirPath.replace(/\\/gi, '/')
  const javascriptFiles = glob.sync(`${ dirPath }/**/*.js`);
  const cssFiles = glob.sync(`${ dirPath }/**/*.css`);
  const htmlFiles = glob.sync(`${ dirPath }/**/*.html`);

  const javascript = await Promise.all(
    javascriptFiles.map(async (file) => {
      return await fs.readFile(file, "utf8");
    })
  );
  const css = await Promise.all(
    cssFiles.map(async (file) => {
      if(file) return await fs.readFile(file, "utf8");
    })
  );
  const html = await Promise.all(
    htmlFiles.map(async (file) => {
      return await fs.readFile(file, "utf8");
    })
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const title = html.match(/<title>(.*)<\/title>/gi)[1];

  return new Promise((resolve) => {
    rl.question(`Enter input ${title} :`, (input) => {
      rl.question("Enter output (comma-separated): ", (output) => {
        rl.close();
        resolve({ javascript, css, html, input, output: output.split(',') });
      });
    });
  });
}

async function main(directoryPathsFile) {
  const dirPaths = JSON.parse(await fs.readFile(directoryPathsFile));
  const results = await Promise.all(
    dirPaths.map(async (dirPath) => {
      return await scanDirectory(dirPath);
    })
  );

  const timestamp = new Date().toISOString().replace(/:/g, "-");
  await fs.writeFile(`${ timestamp }.json`, JSON.stringify(results, null, 2));
  console.log(`Results written to ${timestamp}.json`);
}

program
  .version("0.1.0")
  .description("Scan specified directories for HTML, CSS, and JavaScript code")
  .arguments("<directoryPathsFile>")
  .action(main)
  .parse(process.argv);