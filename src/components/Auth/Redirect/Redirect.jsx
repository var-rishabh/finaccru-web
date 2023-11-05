import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { confirmEmail } from '../../../Actions/User';

const Redirect = () => {
    const query = useLocation().search;
    const params = new URLSearchParams(query);
    const oobCode = params.get('oobCode');
    const mode = params.get('mode');
    const dispatch = useDispatch();
    useEffect(() => {
        if (oobCode && mode) {
            if (mode === 'resetPassword') {
                window.location.href = `/reset?oobCode=${oobCode}`;
            }
            else if (mode === 'verifyEmail') {
                dispatch(confirmEmail({ oobCode: oobCode }));
            }
        }
        else {
            window.location.href = '/';
        }
    }, [])

    return (
        <div>
            Redirecting...
        </div>
    )
}

export default Redirect
