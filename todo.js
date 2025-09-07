import yargs from 'yargs';
import fs from 'fs'; 
import { v4 as uuidv4 } from 'uuid';


const argv = yargs(process.argv.slice(2))
.scriptName('todo')
.usage('Usage: $0 --file <your file name> --optional parmeters')
.example('Usage: $0 --file myToDoList --add "add milk to grocery list"')
.option('file', {
  alias: 'f', 
  type: 'string',
  description: 'Name of file to store your ToDo List',
  demandOption: '--file is a required parameter',
})
.option('add', {
  alias: 'a',
  type: 'string',
  description: `If specified, adds an item to your ToDo List.\nUsage: todo --file myToDoList --add "your ToDo item"`,
})
.option('remove', {
  alias: 'r',
  type: 'string',
  description: `If specified, removes an item to your ToDo List using ToDo by Id.\nToDo Id found in file listing(--list).\nUsage: todo --file myToDoList --remove "your ToDo id".`,
})
.option('list', {
  alias: 'l',
  type: 'boolean', 
  description: `If specified, shows your ToDo List\nUsage: todo --file myToDoList --list`,
})
.option('help', {
  alias: 'h',
  type: 'boolean', 
  description: `If specified, shows how to use the todo script.\nUsage: todo --file myToDoList --help`,
})
.parse() 
// Destructure from argv
const { file, add, remove, list } = argv;

const filename = `${file}.json`
if (!fs.existsSync(filename)) {
  // Create the file if it doesn't exist
  const emptyData = []
  fs.writeFileSync(filename, JSON.stringify(emptyData, null, 2), { flag: 'wx' });
  console.log('File created successfully!');
} else {
  console.log(`Your To Do List ${filename}`);
    //process.exit(1)
}


 
//console.log(`filename: ${filename}`) testing

//console.log(`filename: ${filename}, add : ${add}, remove : ${remove}`) testing

//logic for adds
if (argv.add) {
    //get current date and time
    const now = new Date();
    //console.log(now) testing

    //create unique identifier
    const uuid = (uuidv4().slice(0,5));
    //console.log(uuid); testing

    const jsonArray = [
    {
    id: uuid,
    item: add,
    date: now
    }
    ];

    //console.log(JSON.stringify(jsonArray, null, 2));


    // Function to append array to JSON file
    fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        // Parse the existing JSON data
        const jsonData = JSON.parse(data);
        // console.log(jsonData) testing


        // Ensure the file contains an array or initialize it
        if (!Array.isArray(jsonData)) {
        console.error('JSON file does not contain an array. Initializing a new array.');
        //jsonData = [];
        }


        // Append the new array
        jsonData.push(...jsonArray);

        // Write the updated data back to the file
        fs.writeFile(filename, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return;
        }
        console.log('You have successfully append a new item to your ToDo List.');
        });
    } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
    } 
})} else {
        if (argv.remove){
           fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
    try {
        // Parse the existing JSON data
        let jsonData2 = JSON.parse(data);
        let jsonDataCheck = JSON.parse(data);
        // console.log(jsonData) testing


        // Ensure the file contains an array or initialize it
        if (!Array.isArray(jsonData2)) {
        console.error('JSON file does not contain an array. Initializing a new array.');
        jsonData2 = [];
        }
        if (argv.remove.length < 5 ) {
          console.error('The Todo id is too short. Please enter at least 5 characters.');
          process.exit(1);
        } 

        // Delet from array
        const key = 'id'        
        jsonDataCheck = jsonDataCheck.filter(item=> item[key] === remove);
        if (jsonDataCheck.length === 0) {
            console.error("No matching ToDo id found. Exiting script.");
            process.exit(1);
        }
        jsonData2 = jsonData2.filter(item=> item[key] !== remove); 

 
        // Write the updated data back to the file
        fs.writeFile(filename, JSON.stringify(jsonData2, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return;
        }
        console.log('You successfully removed an item to your ToDo List.');
        });
    } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
    } 
})} else {
    if (list) {
    fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  try {
    // Parse the JSON data
    const parsedData = JSON.parse(data);
    console.log('File content:\n');
        console.log(parsedData);
    }
    catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
}}
};
