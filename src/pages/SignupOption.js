import React, { useEffect } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link } from 'react-router-dom';
import '../styles/login.css';

const SignupOption = () => {

    const { setHeaderMode } = useHeaderMode();
    useEffect(() => {
        setHeaderMode('signup');
    }, [])

    return (
        <div className='wrap2'>
            <Link to={'/agree'}>
                <div className='tuty' />
            </Link>
            <Link to={'/agree'}>
                <div className='tuter' />
            </Link>
        </div>
    );
}

export default SignupOption;