import React, {useState, memo} from 'react';
import {LOGGER_DATA_COLUMN_ID, LOGGER_INDEX_COLUMN_ID, LOGGER_LINE_NUMBER_INDEX_DELTA} from './utils/constants';
import classNames from 'classnames';
import './styles/loggerRow.styles.scss';


const LoggerRow = memo(({index, style, data}) => {
    const {parsedData, loggerRef, rowInFocus, setRowInFocus, setHiglightedindexes} = data;
    const [isHiglighted, setIsHiglighted] = useState(false);
    const [rowSeen, setRowSeen] = useState(false);

    // console.log('This is our data object: ', data);
    // console.log('This is our parsed data: ', parsedData);
    // console.log('This is our index:', index);


    const lookForItemRow = (searchedInput) => {
        const searchedIndex = parseInt(searchedInput);
        loggerRef.current.scrollToItem(searchedIndex);
    }


    const getData = (index) => {
        console.log('We are calling our data: ', parsedData[index]);
        return parsedData[index]; // Can use this function to later add wrapping for syntax highlighting (basic)
    }


    const getRowIndex = (index) => {
        console.log('This is our index: ', index);
        return (index + LOGGER_LINE_NUMBER_INDEX_DELTA);
    }


    const handleHighlightRow = (columnIndex, index) => {
        isHiglighted ? setIsHiglighted(false) : setIsHiglighted(true);
    }


    const highlightText = () => {
        console.log('Second test completed!!!');
    }


    const handleMouseFocusEnter = () => {
        if(rowInFocus !== index)
            return null;

        setRowSeen(true);
    }


    return(
        <div style={style} 
            className='ins-logger-cell'
            onClick={() => handleHighlightRow(index)}
            onMouseEnter={() => handleMouseFocusEnter()}>
            
            <span
                className='ins-logger-cell cell__index-column'>
                {getRowIndex(index)}
            </span>
            <span
                className='ins-logger-cell cell__data-column'
                onClick={highlightText}>
                {getData(index)}
            </span>
        </div>
    )
});


export default LoggerRow;