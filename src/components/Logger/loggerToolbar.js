import React, { useState } from 'react';
import { Button, Level, LevelItem, TextInput } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon, AngleDoubleDownIcon, AngleDoubleUpIcon, SearchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './styles/loggerToolbar.styles.scss';

const LoggerToolbar = ({
    searchedWordIndexes,
    itemCount,
    scrollToRow,
    rowInFocus,
    setRowInFocus,
    hasSearchbar,
    setSearchedInput,
    searchedInput,
    searchForKeyword
}) => {
    const [ userInput, setUserInput ]  = useState('');
    const disablingFlag = searchedInput === '' ? true : false;
    const value = userInput;

    const handlePageDown = () => {
        scrollToRow(itemCount);
    };

    const handlePageUp = () => {
        scrollToRow(0);
    };

    const handleChange = (value) => {
        setUserInput(value);
        setSearchedInput(value.toLowerCase());
    };

    const handleSubmit = () => {
        searchForKeyword();
        handleChange('');
    };

    const handleNextSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);

        if (oldIndex >= searchedWordIndexes.length - 1) {
            return null;
        }

        setRowInFocus(searchedWordIndexes[oldIndex++]);
    };

    const handlePrevSearchItem = () => {
        let oldIndex = searchedWordIndexes.indexOf(rowInFocus);

        if (oldIndex <= 0) {
            return null;
        }

        setRowInFocus(searchedWordIndexes[--oldIndex]);
    };

    const renderSearchBar = () => {
        if (!hasSearchbar) {
            return null;
        }

        return (
            <>
                <TextInput
                    type='text'
                    value={ value }
                    aria-label='logger keyword search bar'
                    onChange={ handleChange }
                    className='toolbar__searchbar'
                />
                <Button
                    onClick={ handleSubmit }
                    className='searchbar__btn'
                    variant='control'
                    isDisabled={ disablingFlag }
                >
                    <SearchIcon />
                </Button>
            </>
        );
    };

    const renderSearchButtons = () => {
        if (searchedWordIndexes.length >= 2) {
            return (
                <>
                    <Button
                        variant='plain'
                        aria-label='Look up'
                        className='toolbar__icons'
                        onClick={ handlePrevSearchItem }
                    >
                        <AngleLeftIcon id='lookUp'/>
                    </Button>
                    <Button
                        variant='plain'
                        aria-label='Look down'
                        className='toolbar__icons'
                        onClick={ handleNextSearchItem }
                    >
                        <AngleRightIcon id='lookDown'/>
                    </Button>
                </>
            );
        }
    };

    return (
        <Level className='logger__toolbar'>
            <LevelItem className='toolbar__searchbar-group'>
                { renderSearchBar() }
            </LevelItem>
            <LevelItem>
                { renderSearchButtons() }
                <Button
                    variant='plain'
                    aria-label='Page up'
                    className='toolbar__icons'
                    onClick={ handlePageUp }
                >
                    <AngleDoubleUpIcon id='pageUp'/>
                </Button>
                <Button
                    variant='plain'
                    aria-label='Page down'
                    className='toolbar__icons'
                    onClick={ handlePageDown }
                >
                    <AngleDoubleDownIcon id='skipDown'/>
                </Button>
            </LevelItem>
        </Level>
    );

};

LoggerToolbar.propTypes = {
    itemCount: PropTypes.number,
    scrollToRow: PropTypes.func,
    rowInFocus: PropTypes.string,
    setRowInFocus: PropTypes.func,
    hasSearchbar: PropTypes.bool,
    setSearchedInput: PropTypes.func,
    searchedInput: PropTypes.string,
    searchForKeyword: PropTypes.func,
    searchedWordIndexes: PropTypes.array
};

export default LoggerToolbar;
