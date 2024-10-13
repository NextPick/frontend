import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import Input from "../components/Input";
import { FaStar } from 'react-icons/fa'; // 별점 아이콘

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
                        size="22px"
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
                    height="57vh"
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
                    height="28vh"
                    width="30vw"
                    border="none"
                    alignItems="flex-start"
                    justify="flex-start"
                    top="10px"
                    direction='column'
                    bottom="10px"
                    style={{ display: 'flex', flexDirection: 'column' }} // 자식 박스에서 정렬
                >
                    <div style={{ marginBottom: '0px', width: '100%' }}>
                        {/* 텍스트와 별점을 수평으로 정렬 */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Font
                                font="PretendardB"
                                size="18px"
                                color="#000000"
                                margintop="5px"
                                spacing="2px"
                                paddingleft="13px"
                                paddingtop="5px"
                                marginbottom="8px"
                            >
                                멘토링 후기를 작성해주세요!
                            </Font>
                            {/* 별점 컴포넌트가 텍스트 오른쪽에 수평으로 위치 */}
                            <div style={{ display: 'flex', marginLeft: '8px' }}>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <FaStar
                                        key={index}
                                        size={20}
                                        color={index < userScore ? '#FFD700' : '#e4e5e9'}
                                        onClick={() => setUserScore(index + 1)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <ReviewForm onSubmitReview={handleSubmitReview} /> {/* ReviewForm 컴포넌트 사용 */}
                    {/* 제출된 리뷰 목록 */}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ height: "20px", width: "30px" }}></div>
                        <Button
                            right="5px"
                            margintbottom="3px"
                            margintop="5px"
                            onClick={handleSubmitReview}
                            fontsize="20px"
                            radius="5px"
                        >
                            제출
                        </Button>
                    </div>

                    <div>
                        {submittedReviews.map((review, index) => (
                            <div key={index}>
                                <div>익명</div> {/* 익명 표시 */}
                                <div>{review.score}점</div>
                                <div>{review.userComment}</div>
                            </div>
                        ))}
                    </div>

                </Box>
            </Box>
        </div>
    );
}

export default InterviewFeedback;