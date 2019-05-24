import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';

// Notifications
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import * as Sentry from '@sentry/browser';

function getEnvironment() {
    const environment = window.location.host.split('.')[0];
    switch(environment) {
        case 'ci':
            return 'CI'
        case 'qa':
            return 'QA'
        case 'cloud':
            return 'PROD'
    }
}

Sentry.init({
    dsn: "https://80e5a70255df4bd3ba6eb3b4bfebc58c@sentry.io/1466891",
    environment: getEnvironment(),
    maxBreadcrumbs: 50,
    debug: true
});

Sentry.captureException(new Error("This is my fake error message"));

class App extends Component {

    componentDidMount () {
        insights.chrome.init();
        insights.chrome.identifyApp('remediations');
    }

    componentWillUnmount () {
        this.appNav();
        this.buildNav();
    }

    render () {
        return (
            <Fragment>
                <NotificationsPortal />
                <Routes childProps={ this.props } />
            </Fragment>
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter (connect()(App));

