import React, {useState, useEffect, memo} from 'react';
import classNames from 'classnames';
import './styles/loggerFooter.styles.scss';
import {Button, Level, LevelItem} from '@patternfly/react-core';
import {AngleLeftIcon, AngleRightIcon} from '@patternfly/react-icons';


const LoggerFooter = ({highlightedRowIndexes}) => {
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(); 
    const [rowIndexes, setRowIndexes] = useState(['temp']);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        console.log('Going into our footers useEffect!!!!!!!!!');
        console.log('')

        if(highlightedRowIndexes.length > 1){
            console.log('Activating our footer: ');
            setIsVisible(true);
        } else{
            console.log('Deactivting our footer')
            setIsVisible(false);
        }

    });

    
    useEffect(() => {
        console.log('This is what we had originally: ', rowIndexes);
        setRowIndexes(highlightedRowIndexes); 
        console.log('This is our new rowIndex: ', highlightedRowIndexes);
    }, [rowIndexes])


    // useState(() => {
    //     console.log('Mapping state to props on footer; Old props: ', highlightedRowIndexes);
    //     settHighlightedIndex

    // }, [currentHighlightedIndex])
    
    //
    // const render

    const mapStateToProps = () => {
        setRowIndexes(highlightedRowIndexes);
    }


    const handleNextHighlightedRow = () => {
        if(rowIndexes.length <= 1) 
            console.log('Cannot move forwards');
        else {
            console.log('We can move forward');
        }
        
    }


    const handlePrevHighlightedRow = () => {
        if(rowIndexes.length <= 1) 
            console.log('Cannot move back');
        else    
            console.log('Can move, we back')

        console.log('My current rowIndex is: ', rowIndexes);
    }


    const displayFooter = () => {
        console.log('This is our footer status: ', isVisible);

        
        return(
                <>
                    {/* <LevelItem>
                        <span className='footer__span'>Highlighted Rows: {}</span>
                    </LevelItem> */}
                    <LevelItem className='footer__icon-group'>
                        <Button variant='plain' className='footer__icons' isSmall onClick={() => handlePrevHighlightedRow()}><AngleLeftIcon /></Button>
                        <Button variant='plain' className='footer__icons' isSmall onClick={() => handleNextHighlightedRow()}><AngleRightIcon/></Button>
                    </LevelItem>
                </>
        );
    }
    

    return(
        <Level className='ins-logger-footer'>
            {displayFooter()}
            {() => mapStateToProps()}
        </Level>
    );
}


export default LoggerFooter;