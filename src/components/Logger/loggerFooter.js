import React, { useState, useEffect } from 'react';
// import classNames from 'classnames';
import './styles/loggerFooter.styles.scss';
import { Button, Level, LevelItem } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const LoggerFooter = ({ highlightedRowIndexes }) => {
    // const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState();
    const [ rowIndexes, setRowIndexes ] = useState([ 'temp' ]);
    const [ isVisible, setIsVisible ] = useState(false);

    useEffect(() => {
        if (highlightedRowIndexes.length > 1 && !isVisible) {
            console.log('Activating our footer: ');
            setIsVisible(true);
        } else {
            console.log('Deactivting our footer');
            setIsVisible(false);
        }
    });

    useEffect(() => {
        setRowIndexes(highlightedRowIndexes);
    }, [ rowIndexes ]);

    const mapStateToProps = () => {
        setRowIndexes(highlightedRowIndexes);
    };

    const handleNextHighlightedRow = () => {
        if (rowIndexes.length <= 1) {
            console.log('Cannot move forwards');
        } else {
            console.log('We can move forward');
        }
    };

    const handlePrevHighlightedRow = () => {
        if (rowIndexes.length <= 1) {
            console.log('Cannot move back');
        }
        else {
            console.log('Can move, we back');
        }

        console.log('My current rowIndex is: ', rowIndexes);
    };

    const displayFooter = () => {
        return (
                <>
                    { /* <LevelItem>
                        <span className='footer__span'>Highlighted Rows: {}</span>
                    </LevelItem> */ }
                    <LevelItem className='footer__icon-group'>
                        <Button
                            variant='plain'
                            className='footer__icons'
                            isSmall
                            onClick={ () => handlePrevHighlightedRow() }
                        >
                            <AngleLeftIcon />
                        </Button>
                        <Button
                            variant='plain'
                            className='footer__icons'
                            isSmall
                            onClick={ () => handleNextHighlightedRow() }
                        >
                            <AngleRightIcon/>
                        </Button>
                    </LevelItem>
                </>
        );
    };

    return (
        <Level className='ins-logger-footer'>
            { displayFooter() }
            { () => mapStateToProps() }
        </Level>
    );
};

LoggerFooter.propTypes = {
    highlightedRowIndexes: PropTypes.array
};

export default LoggerFooter;
