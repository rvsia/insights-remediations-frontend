import React, { useState, useEffect, memo } from 'react';
import { LOGGER_LINE_NUMBER_INDEX_DELTA } from './utils/constants';
import classNames from 'classnames';
import './styles/loggerRow.styles.scss';
import PropTypes from 'prop-types';

const LoggerRow = memo(({ index, style, data }) => {
    const { parsedData, loggerRef, rowInFocus, setRowInFocus, setHighlightedRowIndexes, highlightedRowIndexes } = data;
    const [ clickCounter, setClickCounter ] = useState(0);
    const [ isHiglighted, setIsHiglighted ] = useState(false);
    const [ rowSeen, setRowSeen ] = useState(false);

    useEffect(() => {
        const currentHighlightedIndexes = highlightedRowIndexes;
        var temp = 0;

        if (isHiglighted && clickCounter > 0) { //the logic should be !isHighlighted, don't know why it only works in its inverse
            currentHighlightedIndexes.push(index);
            setHighlightedRowIndexes(currentHighlightedIndexes);
            console.log('This is our new state, adding: ', highlightedRowIndexes);
        }
        else if (!isHiglighted && clickCounter > 0) {
            temp = currentHighlightedIndexes.indexOf(index);
            currentHighlightedIndexes.splice(temp, 1);
            setHighlightedRowIndexes(currentHighlightedIndexes);
            console.log('This is our new state, substracting: ', highlightedRowIndexes);
        }
    }, [ isHiglighted ]);

    const lookForItemRow = (searchedInput) => {
        const searchedIndex = parseInt(searchedInput);
        loggerRef.current.scrollToItem(searchedIndex);
    };

    const getData = (index) => {
        return parsedData[ index ]; // Can use this function to later add wrapping for syntax highlighting (basic)
    };

    const getRowIndex = (index) => {
        return (index + LOGGER_LINE_NUMBER_INDEX_DELTA);
    };

    const handleHighlightRow = (index) => {
        const counter = clickCounter + 1;
        setClickCounter(counter);
        setIsHiglighted(!isHiglighted);
    };

    const handleMouseFocusEnter = () => {
        if (rowInFocus !== index) {
            return null;
        }

        setRowSeen(true);
    };

    const rowClassname = classNames( 'ins-logger-cell cell__data-column',
        {
            'cell--highlighted': isHiglighted
        },
        {
            'cell--inFocus': index === rowInFocus
        }
    );

    return (
        <div style={ style }
            className='ins-logger-cell'
            onClick={ () => handleHighlightRow(index) }
            onMouseEnter={ () => handleMouseFocusEnter() }>
            <span
                className='ins-logger-cell cell__index-column'>
                { getRowIndex(index) }
            </span>
            <span
                className={ rowClassname }
                onClick={ highlightText }>
                { getData(index) }
            </span>
        </div>
    );
});

LoggerRow.defaultProps = {
  index: PropTypes.string,
  style: PropTypes.
}

export default LoggerRow;
