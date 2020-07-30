import React, {useState, memo} from 'react';
import {LOGGER_DATA_COLUMN_ID, LOGGER_INDEX_COLUMN_ID, LOGGER_LINE_NUMBER_INDEX_DELTA} from './utils/constants';
import classNames from 'classnames';
import './styles/loggerRow.styles.scss';


const LoggerRow = memo(({columnIndex, rowIndex, style, data}) => {
    const {parsedData, loggerRef, rowInFocus, setRowInFocus, setHiglightedRowIndexes} = data;
    const [isHiglighted, setIsHiglighted] = useState(false);
    const [rowSeen, setRowSeen] = useState(false);


    const lookForItemRow = (searchedInput) => {
        const searchedIndex = parseInt(searchedInput);
        loggerRef.current.scrollToItem(searchedIndex);
    }


    const getData = (colIndex, rowIndex) => {
       return colIndex == LOGGER_DATA_COLUMN_ID ? parsedData[rowIndex]
            : (colIndex == LOGGER_INDEX_COLUMN_ID) ? (rowIndex + LOGGER_LINE_NUMBER_INDEX_DELTA)
            : '' ;// this would eventually be replaced with time stamp data    
    } 


    const getDataR = (rowIndex) => {
        console.log('We are calling our data: ', parsedData[rowIndex]);
        return parsedData[rowIndex]; // Can use this function to later add wrapping for syntax highlighting (basic)
    }


    const getRowIndex = (rowIndex) => {
        return (rowIndex + LOGGER_LINE_NUMBER_INDEX_DELTA);
    }


    const handleHighlightRow = (columnIndex, rowIndex) => {
        isHiglighted ? setIsHiglighted(false) : setIsHiglighted(true);
    }


    const highlightText = () => {
        console.log('Second test completed!!!');
    }


    const handleMouseFocusEnter = () => {
        if(rowInFocus !== rowIndex)
            return null;

        setRowSeen(true);
    }
    // const cellClassname = classNames( 'ins-logger-cell', {
    //     'cell__index-column': columnIndex === 0,
    //     'cell__data-column': columnIndex === 1, 
    //     'cell__stamp-column': columnIndex === 2 
    // }, {
    //     'cell--highlighted': isHiglighted
    // }, {
    //     'cell--inFocus': rowIndex === rowInFocus && !rowSeen && columnIndex === 1
    // });

    // const cellSpanClassname = classNames({
    //     'cell__index-span': columnIndex == 0,
    //     'cell__data-span': columnIndex == 1,
    //     'cell__stamp-span': columnIndex == 2  
    // });
    return(
        <div style={style} 
            className='cell__data-column'
            onClick={() => handleHighlightRow(columnIndex, rowIndex)}
            onMouseEnter={handleMouseFocusEnter}>
            {/* <span
                className={cell__index-column}
                onMouseEnter={handleMouseFocusEnter}>
                {getData(rowIndex)}
            </span> */}
            <span
                className='cell__index-column'>
                {() => getRowIndex}
            </span>
            <span
                className='cell__data-span'
                onClick={highlightText}>
                {() => getDataR(rowIndex)}
            </span>
            {/* <span 
                className={cellSpanClassname}
                onClick={highlightText}>
                {getData(columnIndex, rowIndex)}
            </span> */}
        </div>
    )
});


export default LoggerRow;