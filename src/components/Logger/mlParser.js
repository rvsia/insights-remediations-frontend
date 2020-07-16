import React, {useState} from 'react';
import YAML from 'yaml';

// Putting this class on ice for now. Was trying to overengineer the problem. Once I start taking into account
// Ansible and other types of parsing with might have to do, we can worry about making this a functional class for the team. 

const MLParser = () => {
    // const [data, setData] = useState(props.data);
    // const {typeOfPropsData, keyword} = props; //dataType tells us whether we are dealing with Yaml file or JSON
    // const stringifieddObj = YAML.stringify(data);
    // const parsedObj = YAML.parse(stringifieddObj);

    // console.log('This is the data coming from the file: ', dataFromFile);
    // console.log('This is the data being parsed from an object: ', parsedObj);
    // console.log('This is my stringified YAML file: ', stringifieddObj);

    const cleanUpStringArray = (data) => {
        console.log("This is the data being cleaned out: \n", data);
    
        const cleaninRegEx = new RegExp('(\s+\\+[a-zA-Z])|"|(\n\s)');
        let cleanArray = [];
        let s = "";
        let spaceCounter = 0;
    
        for (s of data){
            if(!cleaninRegEx.test(s)){
                if (s !== "" || s){
                    spaceCounter++;
                    cleanArray.push(s)
                }
            }
        }
       
        console.log('This is our counter: ', spaceCounter);
        console.log("This is our cleaned out array: \n", cleanArray);
        return cleanArray;
    };
    
    
    const parseConsoleOutput = (data) => {
        const stringToSplitWith = "\n";
        const stringifiedData = YAML.stringify(data);
        
        console.log("Ths is my stringified data: \n", stringifiedData);
        const cleanString = stringifiedData.split(stringToSplitWith);
        
        return cleanUpStringArray(cleanString);
    }

    // Will grab the block of text following the keyword
    const searchForKeywordInString = (keyword) => {
        
    }

    const searchForKeywordInObject = (keyword) => {

    }

}

export default MLParser;