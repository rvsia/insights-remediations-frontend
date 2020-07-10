import React, { useState, useRef, useCallback, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getConnectionStatus, runRemediation, setEtag, getPlaybookRuns, loadRemediation } from '../actions';
import { remediations } from '../api';

import ExecuteButton from '../components/ExecuteButton';

export const ExecutePlaybookButton = withRouter(connect(
    ({ connectionStatus: { data, status, etag }, selectedRemediation, runRemediation }) => ({
        data,
        isLoading: status !== 'fulfilled',
        issueCount: selectedRemediation.remediation.issues.length,
        etag,
        remediationStatus: runRemediation.status
    }),
    (dispatch) => ({
        getConnectionStatus: (id) => {
            console.log('getting statussssss');
            dispatch(getConnectionStatus(id));
        },
        runRemediation: (id, etag) => {
            console.log('running remediationnnnn');
            dispatch(runRemediation(id, etag)).then(() => dispatch(getPlaybookRuns(id)));
        },
        setEtag: (etag) => {
            dispatch(setEtag(etag));
        }

    })
)(ExecuteButton));

export const ExecuteRemediationActionButton = ( {remediationId, isDisabled} ) => {

    const [ ready, setReady ] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('USE EFFECT: ', remediationId);
        dispatch(loadRemediation(remediationId)).then(() => dispatch(getConnectionStatus(remediationId))).then(() => setReady(true));
    }, []);

    const selected = useSelector(state => state.selectedRemediation);
    const connStatus = useSelector(state => state.connectionStatus);
    const runRem = useSelector(state => state.runRemediation);

    console.log('selectedddd: ', selected);

    const conn = (id) => {
        console.log(id);
        dispatch(getConnectionStatus(id));
    }
    const run = (id, etag) => {
        console.log('running remediation: ', id);
        dispatch(runRemediation(id, etag)).then(() => dispatch(getPlaybookRuns(id)));
    }
    const tag = (etag) => {
        console.log('setting etag to: ', etag);
        dispatch(setEtag(etag));
    }

    return (
        ready && <ExecuteButton
            remediationId = { remediationId }
            isDisabled = { isDisabled }
            data = { connStatus.data }
            etag = { connStatus.etag }
            isLoading = { connStatus.status !== 'fulfilled'}
            issueCount = { selected.remediation.issues.length }
            remediationStatus = { runRem.status }
            getConnectionStatus = { conn }
            runRemediation = { run }
            setEtag = { tag }
        />
    );
}
