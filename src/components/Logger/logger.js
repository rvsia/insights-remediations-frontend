import React, {useEffect, useState, memo, useRef} from 'react';
import { VariableSizeList as List, areEqual } from 'react-window'; 
import LoggerRow from './loggerRow';
import LoggerToolbar from './loggerToolbar';
import LoggerHeader from './loggerHeader';
import LoggerFooter from './loggerFooter';
import memoize from 'memoize-one';
import {LOGGER_ROW_HEIGHT, LOGGER_HEIGHT, LOGGER_WIDTH} from './utils/constants';
import MLParser from './mlParser';
import YAML from 'yaml';
import './styles/base.scss';
import './styles/logger.styles.scss';
import './styles/styles.css';


// To be moved as a helper function to mlParser
const cleanUpStringArray = (data) => { // Needs refactoring and refinement *later*
    const cleaninRegEx = new RegExp('(\s+\\+[a-zA-Z])|"|(\n\s)');
    let cleanArray = [];
    let s = "";
    let spaceCounter = 0;
    console.log('This is our split: ', data);

    // for (s of data){
    //     if(!cleaninRegEx.test(s)){
    //         if (s !== "" ){
    //             spaceCounter++;
    //             cleanArray.push(s)
    //         }
    //     }
    // }   

    // return cleanArray;
    return data;
};

// To be moved as a helper function to mlParser
const parseConsoleOutput = (data) => {
    const stringToSplitWith1 = "\n";
    const stringToSplitWith = '\n';
    const stringifiedData = YAML.stringify(data);
    console.log('This is our stringified data: ', stringifiedData);
    
    const cleanString = stringifiedData.split(stringToSplitWith);
    console.log('this is our cleaned data: ', cleanString);   

    const cleanString1 = stringifiedData.split(stringToSplitWith1);
    
    console.log('this is our clean1: ', cleanString1);

    console.log('This is our raw data: ', data);
    
    return cleanUpStringArray(cleanString);
}

// Wrapping multiple variables around memoization to rerender loggerRow only when these change, and to send both through a single obj. 
const createLoggerDataItem = memoize((parsedData, searchedInput, loggerRef, rowInFocus, setRowInFocus, highlightedRowIndexes, setHighlightedRowIndexes, searchedWordIndexes) => ({
    parsedData, 
    searchedInput,
    loggerRef,
    rowInFocus,
    setRowInFocus, 
    highlightedRowIndexes,
    setHighlightedRowIndexes, 
    searchedWordIndexes
}));


// Remember to change to only expecting the exact yaml part that we'll be parsing out, rather than looking for it through this component. We need to slim down the logic. 
const Logger = memo(({hasSearchbar, includesLoadingStatus, path ,data, isPayloadConsole, searchedKeyword}) => { 
    const [parsedData, setParsedData] = useState([]);
    const [searchedInput, setSearchedInput] = useState('');
    const [searchedWordIndexes, setSearchedWordIndexes] = useState([]); 
    const [highlightedRowIndexes, setHighlightedRowIndexes] = useState([]); 
    const [rowInFocus, setRowInFocus] = useState('');
    const loggerRef = React.useRef();
    const dataToRender = createLoggerDataItem(parsedData, searchedInput, loggerRef, rowInFocus, setRowInFocus, highlightedRowIndexes, setHighlightedRowIndexes, searchedWordIndexes); 


    useEffect(() => {
        isPayloadConsole 
            ? setParsedData(parseConsoleOutput(data.console)) // instead of looking for what to parse, it should expect the 'message' to be parsed directly. Add this to the docs(when you make one)
            : setParsedData('');  // We would substitute parseConsoleOutput with something that would parse the correct thing(whatever that is)
    }, []);


    useEffect(() => {
        if(searchedWordIndexes.length !== 0)
            scrollToRow(searchedWordIndexes[0]);

    }, [searchedWordIndexes]);


    useEffect(() => {
        console.log('Me estoy renderizando?');
        scrollToRow(rowInFocus);
    }, [rowInFocus]);


    useEffect(() => {
        console.log('This is the state of our highlighted indexes: ', highlightedRowIndexes);
    }, [highlightedRowIndexes]);


    const searchForKeyword = () => {
        let rowIndexCounter = 0;
        let searchResults = [];
    
        
        if(searchedInput.match(':')){
            const splitInput = searchedInput.split(':');
            scrollToRow(parseInt(splitInput[1])); // Needs input validation/Clean Up for readability later
            setSearchedInput('');
            return;
        } 
        
        for(const row of parsedData){
            const lowerCaseRow = row.toLowerCase();
            const keywordIndexPosition = lowerCaseRow.search(searchedInput);
           
            if(keywordIndexPosition !== -1)
                searchResults.push(rowIndexCounter);
            
            rowIndexCounter++;
        }

        setSearchedWordIndexes(searchedWordIndexes => [...searchResults]); // gonna need a way for the user to clear these
    }


    const calculateItemsPerPage = () => {
        return Math.round(LOGGER_HEIGHT / LOGGER_ROW_HEIGHT); // This will have to change with collapsible rows
    }


    const scrollToRow = (searchedRowIndex) => {
        setRowInFocus(searchedRowIndex);     
        loggerRef.current.scrollToItem(searchedRowIndex, 'center');

        return true; 
    }

    
    const setRowHeight = (index) => {
        return index % 2 == 0
            ? LOGGER_ROW_HEIGHT
            : LOGGER_ROW_HEIGHT;
    }


    return(
        <>
          <div className='ins-c-logger' hasGutter>
                <LoggerToolbar 
                    rowInFocus={rowInFocus}
                    setRowInFocus={setRowInFocus}
                    scrollToRow={scrollToRow}
                    loggerRef={loggerRef}
                    itemCount={parsedData.length}
                    searchedWordIndexes={searchedWordIndexes}
                    itemsPerPage={calculateItemsPerPage}
                    hasSearchbar={hasSearchbar}
                    searchedInput={searchedInput}
                    setSearchedInput={setSearchedInput}
                    searchForKeyword={searchForKeyword}
                />
                <List 
                    className='logger__grid'
                    rowHeight={index => setRowHeight(index)}
                    height={LOGGER_HEIGHT}
                    width={LOGGER_WIDTH}
                    itemSize={() => 30}
                    itemCount={parsedData.length}
                    itemData={dataToRender}
                    ref={loggerRef}
                >
                    {LoggerRow}
                </List>
                <LoggerFooter 
                    highlightedRowIndexes={highlightedRowIndexes}
                />
          </div>
        </>
    );
}, areEqual);


Logger.defaultProps =  {
    isPayloadConsole: true,
    hasSearchbar: true,
    includesLoadingStatus: true,
    searchedKeyword: '', 
    path: '.console'
};

export default Logger;