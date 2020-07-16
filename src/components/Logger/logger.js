import React, {useEffect, useState, memo, useRef} from 'react';
import { VariableSizeGrid as Grid, areEqual } from 'react-window'; 
import LoggerRow from './loggerRow';
import LoggerToolbar from './loggerToolbar';
import LoggerHeader from './loggerHeader';
import memoize from 'memoize-one';
import {LOGGER_COLUMNS_AMOUNT, LOGGER_INDEX_COLUMN_WIDTH, LOGGER_DATA_COLUMN_WIDTH, LOGGER_ROW_HEIGHT, LOGGER_STAMP_COLUMN_WIDTH, LOGGER_HEIGHT, LOGGER_WIDTH} from './utils/constants';
import MLParser from './mlParser';
import YAML from 'yaml';

// change how the CSS is loaded. We only need to load the base stuff once.
import './styles/base.scss';
import './styles/logger.styles.scss';
import './styles/styles.css';


// To be moved as a helper function to mlParser
const cleanUpStringArray = (data) => { // Needs refactoring and refinement *later*
    const cleaninRegEx = new RegExp('(\s+\\+[a-zA-Z])|"|(\n\s)');
    let cleanArray = [];
    let s = "";
    let spaceCounter = 0;

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
    const stringToSplitWith = "\n";
    const stringifiedData = YAML.stringify(data);
    const cleanString = stringifiedData.split(stringToSplitWith);
    
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


// Need to finish cleaning up/refactoring some redundancies in the code here
const Logger = memo(({logTitle, includesToolbar, includesLoadingStatus ,data, isPayloadConsole, searchedKeyword}) => { 
    const [parsedData, setParsedData] = useState([]);
    const [searchedInput, setSearchedInput] = useState('');
    const [searchedWordIndexes, setSearchedWordIndexes] = useState([]); 
    const [highlightedRowIndexes, setHighlightedRowIndexes] = useState([]); // Pending refactoring of useState to just grabbing a whole object for all indexes 
    const [rowInFocus, setRowInFocus] = useState('');
    const loggerRef = React.useRef();
    const dataToRender = createLoggerDataItem(parsedData, searchedInput, loggerRef, rowInFocus, setRowInFocus, highlightedRowIndexes, setHighlightedRowIndexes, searchedWordIndexes); 


    useEffect(() => {
        isPayloadConsole 
            ? setParsedData(parseConsoleOutput(data.message.payload.console))
            : setParsedData('');  // We would substitute parseConsoleOutput with something that would parse the correct thing(whatever that is)
    }, []);


    useEffect(() => {
        if(searchedWordIndexes.length !== 0)
            scrollToRow(searchedWordIndexes[0]);

    }, [searchedWordIndexes]);


    useEffect(() => {
        scrollToRow(rowInFocus);
    }, [rowInFocus]);


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
        loggerRef.current.scrollToItem({
            align:'center',
            columnIndex:1,
            rowIndex:searchedRowIndex
        })
        
        return true; 
    }


    const setColumnWidth = (index) => {
        return index == 0 
            ?   LOGGER_INDEX_COLUMN_WIDTH 
            :   index == 2
                ?   LOGGER_STAMP_COLUMN_WIDTH
                :   LOGGER_DATA_COLUMN_WIDTH;
    }

    
    const setRowHeight = (index) => {
        return index % 2 == 0
            ? LOGGER_ROW_HEIGHT
            : LOGGER_ROW_HEIGHT;
    }


    return(
        <>
          <div className='ins-c-logger' hasGutter>
              <div className='logger__header'>
                  <LoggerHeader 
                      searchedInput={searchedInput}
                      setSearchedInput={setSearchedInput}
                      searchForKeyword={searchForKeyword}
                  />
              </div>
              <LoggerToolbar 
                  rowInFocus={rowInFocus}
                  setRowInFocus={setRowInFocus}
                  scrollToRow={scrollToRow}
                  loggerRef={loggerRef}
                  itemCount={parsedData.length}
                  searchedWordIndexes={searchedWordIndexes}
                  itemsPerPage={calculateItemsPerPage}
                  nextSearchedIndex={nextSearchedIndex}
              />
              <Grid 
                  className='logger__grid'
                  rowCount={parsedData.length}
                  columnCount={LOGGER_COLUMNS_AMOUNT}
                  columnWidth={index => setColumnWidth(index)}
                  rowHeight={index => setRowHeight(index)}
                  height={LOGGER_HEIGHT}
                  width={LOGGER_WIDTH}
                  itemSize={30}
                  itemCount={parsedData.length}
                  itemData={dataToRender}
                  ref={loggerRef}
              >
                {LoggerRow}
              </Grid>
          </div>
        </>
    );
}, areEqual);


Logger.defaultProps =  {
    isPayloadConsole: true,
    includesToolbar: true,
    includesLoadingStatus: true,
    searchedKeyword: ''
};

export default Logger;