import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import Input from "../components/Input";
import ReviewForm from '../components/ReviewForm ';


const InterviewFeedback = () => {
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const [userScore, setUserScore] = useState(0); // 사용자의 별점
    const [userReview, setUserReview] = useState(''); // 사용자의 리뷰
    const [submittedReviews, setSubmittedReviews] = useState([]); // 제출된 리뷰들

    const handleSubmitReview = (newReview) => {
        setSubmittedReviews((prevReviews) => [...prevReviews, newReview]); // 리뷰 추가
    };

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);


    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box
                height="100%"
                width="35vw"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
                style={{ display: 'flex' }} // 자식 박스에서 정렬
            >
                <div style={{ marginBottom: '5px', width: '100%' }}>
                    <Font
                        font="PretendardL"
                        size="10px"
                        color="#000000"
                        margintop="5px"
                        spacing="2px"
                        paddingleft="13px"
                        paddingtop="5px"
                        marginbottom="8px"
                    >
                        멘토 피드백
                    </Font>
                </div>
                <Box
                    height="60vh"
                    width="30vw"
                    border="none"
                    alignItems="center"
                    justify="center"
                    top="10px"
                    bottom="10px"
                    style={{ display: 'flex' }} // 자식 박스에서 정렬
                >
                </Box>
                <Box
                    height="15vh"
                    width="30vw"
                    border="none"
                    alignItems="flex-start"
                    justify="flex-start"
                    top="10px"
                    direction='column'
                    bottom="10px"
                    style={{ display: 'flex', flexDirection: 'column' }} // 자식 박스에서 정렬
                >
                    <div style={{ marginBottom: '5px', width: '100%' }}>
                        <Font
                            font="PretendardL"
                            size="10px"
                            color="#000000"
                            margintop="5px"
                            spacing="2px"
                            paddingleft="13px"
                            paddingtop="5px"
                            marginbottom="8px"
                        >
                            튜터링 만족평가
                        </Font>
                    </div>
                    <Font font="PretendardL" size="10px" color="#000000" marginbottom="5px">
                    튜터링 리뷰 작성
                    </Font>
                <ReviewForm onSubmitReview={handleSubmitReview} /> {/* ReviewForm 컴포넌트 사용 */}
                {/* 제출된 리뷰 목록 */}
                <div>
                    {submittedReviews.map((review, index) => (
                        <div key={index}>
                            <div>익명</div> {/* 익명 표시 */}
                            <div>{review.score}점</div>
                            <div>{review.userComment}</div>
                        </div>
                    ))}
                </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}> {/* 버튼들을 수평으로 정렬하기 위한 div */}
                        <Button
                            height="4vh"
                            width="5vw"
                            border="none"
                            radius="3px"
                            color="#0372f396"
                            padding="0px"
                        >
                            <Font
                                font="PretendardB"
                                size="8px"
                                color="#000000"
                                margintop="0px"
                                paddingtop="1px"
                                spacing="2px"
                                align="center"
                            >
                                제출하기
                            </Font>
                        </Button>
                        <Button
                            height="4vh"
                            width="5vw"
                            border="none"
                            radius="3px"
                            color="#0372f396"
                            padding="0px"
                        >
                            <Font
                                font="PretendardB"
                                size="8px"
                                color="#000000"
                                margintop="0px"
                                paddingtop="1px"
                                spacing="2px"
                                align="center"
                            >
                                신고하기
                            </Font>
                        </Button>
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default InterviewFeedback;