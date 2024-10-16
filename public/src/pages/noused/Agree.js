import React, { useEffect, useState } from 'react';
import TextBox from '../components/TextBox';
import { useHeaderMode } from '../hooks/HeaderManager';
import termsOfService from '../static/termsOfService ';
import Button from '../components/Button';
import { Link } from 'react-router-dom';


const Agree = () => {

    const { setHeaderMode } = useHeaderMode();
    const [text, setText] = useState(termsOfService); // text 상태 정의
    const [allCheck, setAllCheck] = useState(false);
    const [ageCheck, setAgeCheck] = useState(false);
    const [useCheck, setUseCheck] = useState(false);
    const [marketingCheck, setMarketingCheck] = useState(false);

    const handleChange = (e) => {
        setText(e.target.value); // input의 value를 상태에 업데이트
    };

    const allBtnEvent = () => {
        if (allCheck === false) {
            setAllCheck(true);
            setAgeCheck(true);
            setUseCheck(true);
            setMarketingCheck(true);
        } else {
            setAllCheck(false);
            setAgeCheck(false);
            setUseCheck(false);
            setMarketingCheck(false);
        }
    };

    const ageBtnEvent = () => {
        if (ageCheck === false) {
            setAgeCheck(true)
        } else {
            setAgeCheck(false)
        }
    };

    const useBtnEvent = () => {
        if (useCheck === false) {
            setUseCheck(true)
        } else {
            setUseCheck(false)
        }
    };

    const marketingBtnEvent = () => {
        if (marketingCheck === false) {
            setMarketingCheck(true)
        } else {
            setMarketingCheck(false)
        }
    };

    useEffect(() => {
        setHeaderMode('signup');
    }, [])

    useEffect(() => {
        if (ageCheck === true && useCheck === true && marketingCheck === true) {
            setAllCheck(true)
        } else {
            setAllCheck(false)
        }
    }, [ageCheck, useCheck, marketingCheck])

    return (
        <div className='wrapBox'>
            <div className='agreeBox'>
                <TextBox
                    value={text}
                    onChange={handleChange}
                    readOnly={true}
                />
            </div>
            <div className='agreeBox'>
                <TextBox
                    value={text}
                    onChange={handleChange}
                    readOnly={true}
                />
            </div>
            <div style={{ fontSize: "7px" }}>
                <form method="post" action="" style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}> {/* 폼 요소, 제출 방식과 스타일 설정 */}
                    <div style={{ marginBottom: '3px' }}> {/* 약관 동의 섹션 */}
                        <label style={{ fontSize: '8px', fontWeight: 'bold' }}> {/* 약관 동의 제목 */}
                            약관동의
                        </label>
                        <div style={{ marginTop: '7px' }}> {/* 약관 동의 체크박스들 감싸는 박스 */}
                            <div style={{display: 'flex', alignItems: 'center' }}> {/* 전체 동의 체크박스 */}
                                <input
                                    type="checkbox"
                                    id="all-check"
                                    checked={allCheck}
                                    onChange={allBtnEvent} // 전체 동의 체크박스 변화 이벤트 핸들러
                                    style={{ transform: 'scale(0.8)' }} // 체크박스 크기 줄이기
                                />
                                <label htmlFor="all-check">전체동의</label> {/* 전체 동의 체크박스에 대한 레이블 */}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}> {/* 만 14세 이상 동의 체크박스 */}
                                <input
                                    type="checkbox"
                                    id="check1"
                                    checked={ageCheck}
                                    onChange={ageBtnEvent} // 만 14세 이상 체크박스 변화 이벤트 핸들러
                                    style={{ transform: 'scale(0.8)' }} // 체크박스 크기 줄이기
                                />
                                <label htmlFor="check1">만 14세 이상입니다 <span style={{ color: 'blue' }}>(필수)</span></label> {/* 체크박스에 대한 레이블 */}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}> {/* 이용약관 동의 체크박스 */}
                                <input
                                    type="checkbox"
                                    id="check2"
                                    checked={useCheck}
                                    onChange={useBtnEvent} // 이용약관 체크박스 변화 이벤트 핸들러
                                    style={{ transform: 'scale(0.8)' }} // 체크박스 크기 줄이기
                                />
                                <label htmlFor="check2">이용약관 <span style={{ color: 'blue' }}>(필수)</span></label> {/* 체크박스에 대한 레이블 */}
                            </div>
                            <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}> {/* 마케팅 동의 체크박스 */}
                                <input
                                    type="checkbox"
                                    id="check3"
                                    checked={marketingCheck}
                                    onChange={marketingBtnEvent} // 마케팅 동의 체크박스 변화 이벤트 핸들러
                                    style={{ transform: 'scale(0.8)' }} // 체크박스 크기 줄이기
                                />
                                <label htmlFor="check3">마케팅 동의 <span style={{ color: 'gray' }}>(선택)</span></label> {/* 체크박스에 대한 레이블 */}
                            </div>
                        </div>

                    </div>
                    <Link to={'/signup'}>
                    <Button
                        color="#FFFFFF"
                        width="12vw"
                        textcolor="#000000"
                        margintop="0px"
                        height="25px"
                        border="0.5px solid black;"
                        radius="5px"
                        hoverColor="#1780f93a"
                        fontfamily="PretendardL"
                        fontsize="8px"
                    >
                        회원가입하러가기
                    </Button>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Agree;