import React, { useEffect } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font.js';
import { Link } from 'react-router-dom';

const Login = () => {

    const { setHeaderMode } = useHeaderMode();
    useEffect(() => {
        setHeaderMode('signup');
    }, [])

    return (
        <div className='wrap'>
            <div className='backgroundbox' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10vh'}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Font
                            font="PretendardL"
                            size="14px"
                            color="#000000"
                            align="left"
                            margintop="12px"
                        >
                            I.D
                        </Font>
                        <input style={{ marginLeft: '10px' }}></input>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <Font
                            font="PretendardL"
                            size="14px"
                            color="#000000"
                            align="left"
                             margintop="13px"
                        >
                            P.W
                        </Font>
                        <input style={{ marginLeft: '4px' }}></input>
                    </div>
                    <Button
                        color="#FFFFFF"
                        width="10vw"
                        textcolor="#000000"
                        margintop="10px"
                        height="25px"
                        border="0.5px solid black;"
                        radius="5px"
                        hoverColor="#A0AFC1"
                        fontfamily="PretendardL"
                    >
                        Login
                    </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '-40px'}}>
                    <Link to={'/singupOption'}>
                    <Button
                        color="transparent"
                        width="20vw"
                        textcolor="#000000"
                        margintbottom="10px"  // 간격 조정
                        height="25px"
                        hoverColor="#ffffff"
                        fontsize="10px"
                    >
                        회원가입
                    </Button>
                    </Link>
                    <Button
                        color="transparent"
                        width="20vw"
                        textcolor="#000000"
                        margintbottom="10px"  // 간격 조정
                        height="25px"
                        hoverColor="#ffffff"
                        fontsize="10px"
                    >
                        아이디/비밀번호 찾기
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;