import React, {useState, useEffect} from 'react';
import { Button, Level, LevelItem } from '@patternfly/react-core';

import { AngleLeftIcon, AngleRightIcon, AngleDownIcon, AngleUpIcon, AngleDoubleDownIcon, AngleDoubleUpIcon, SearchIcon } from '@patternfly/react-icons';
import classNames from 'classnames';
import './styles/loggerToolbar.styles.scss';


const LoggerToolbar = ({searchedWordIndexes, itemCount, scrollToRow, rowInFocus, setRowInFocus}) => {
    // const []
    let searchInput = '';


    const handlePageDown = () => {
        scrollToRow(itemCount);
    }

    const handlePageUp = () => {
        scrollToRow(0);
    }

    const handleSkipUp = () => {

    }

    const handleSkipDown = () => {

    }

    const handleNextSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);

        if(oldIndex >= searchedWordIndexes.length-1)
            return null;
        
        setRowInFocus(searchedWordIndexes[++oldIndex]);        
    }

    const handlePrevSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);

        if(oldIndex <= 0)
            return null;

        setRowInFocus(searchedWordIndexes[--oldIndex]);
    }


    const renderSearchButtons = () => {
        if(searchedWordIndexes.length >= 2) {
            return(
                <>
                    {/* <span className='toolbar__label toolbar--left-hand'>Searching: {`${searchInput}`} </span> */}
                    <Button variant='plain' aria-label='Look up' className='toolbar__icons'><AngleLeftIcon id='lookUp'  onClick={handlePrevSearchItem}/></Button>
                    <Button variant='plain' aria-label='Look down' className='toolbar__icons'><AngleRightIcon id='lookDown' onClick={handleNextSearchItem}/></Button>
                </>
            );
        }
    }

    // The span needs to appear and dissapear depending on whether the logger includes a searchbar or not
    // The lookUp/lookDown arrows need to be conditionally rendered depending on whether logger includes a searchbar or not
    return(
        <Level className='logger__toolbar'>
            <LevelItem>
                {renderSearchButtons()}
            </LevelItem>
            <LevelItem>
                <Button variant='plain' aria-label='Skip up' className='toolbar__icons'><AngleUpIcon id='skipUp'/></Button>
                <Button variant='plain' aria-label='Skip down' className='toolbar__icons'><AngleDownIcon id='skipDown'/></Button>
                <Button variant='plain' aria-label='Page up' className='toolbar__icons' onClick={handlePageUp}><AngleDoubleUpIcon id='pageUp'/></Button>
                <Button variant='plain' aria-label='Page down' className='toolbar__icons' onClick={handlePageDown}><AngleDoubleDownIcon id='skipDown'/></Button>
            </LevelItem>
        </Level>
    );

}


export default LoggerToolbar;