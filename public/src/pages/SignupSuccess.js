import React, { useEffect } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font.js';
import { Link } from 'react-router-dom';


const SignupSuccess = () => {
    const { setHeaderMode } = useHeaderMode();
    useEffect(() => {
        setHeaderMode('signup');
    }, [])

    return (
        <div className='wrap' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className='backgroundbox' style={{ textAlign: 'center', width:"42vw",  marginBottom: '50px' }}>
                <div style={{ marginBottom: '0px' }}>
                    <Font
                        font="PretendardB"
                        size="40px"
                        color="#000000"
                        align="left"
                        margintop="45px"
                        spacing="6px"
                        height="52px"
                    >
                        지금 바로 나의 지식을 
                        <p>확인하세요</p>
                    </Font>
                    <Font
                        font="PretendardL"
                        size="22px"
                        color="#000000"
                        align="left"
                        margintop="12px"
                        spacing="2px"
                    >
                        가입하면 나만을 위한 면접 피드백이
                    </Font>

                    <Link to={'/login'}>
                        <Button
                        active=""
                            color="transparent"
                            width="20vw"
                            textcolor="#000000"
                            hoverColor="#ffffff"
                            fontsize="25px"
                            margintop="55px"
                            hoverTextColor="black"
                        >
                            로그인으로 계속하기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignupSuccess;