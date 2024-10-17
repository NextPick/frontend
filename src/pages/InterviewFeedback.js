import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import {useLocation, useNavigate} from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import { FaStar } from 'react-icons/fa'; // 별점 아이콘
import ReviewForm from '../components/ReviewForm ';
import axios from "axios";

const InterviewFeedback = () => {
    const accessToken = localStorage.getItem('accessToken');
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const [userScore, setUserScore] = useState(0); // 사용자의 별점
    const [userReview, setUserReview] = useState(''); // 사용자의 리뷰
    const [submittedReviews, setSubmittedReviews] = useState([]); // 제출된 리뷰들
    const location = useLocation();
    const {roomId} = location.state || 0;
    const [mentorId, setMentorId] = useState('');
    const [feedback, setFeedback] = useState('');
    const [mentorNickname, setMentorNickname] = useState('');
    const [content, setContent] = useState('');
    const [isTrue, setIsTrue] = useState(false);
    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    const handleSubmitReview = async () => {
        const newReview = {
            score: userScore,
            userComment: userReview,
        };

        setSubmittedReviews((prevReviews) => [...prevReviews, newReview]); // 리뷰 추가

        // 피드백 API 호출
        await handleMentorFeedback();
    };

    const handleGetMenteeFeedback = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}mentee/feedback/${roomId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 인증 헤더 설정
                }
            });

            if (response.data && response.data.data) {
                let data = response.data.data;
                setContent(data.content);
                setMentorNickname(data.mentorNickname);
                setMentorId(data.mentorId);
            } else {
                console.error("Received unexpected response structure:", response.data);
            }
        } catch (error) {
            console.error("멘티 피드백을 불러오는 중 오류 발생:", error); // 오류 메시지 출력
            alert("멘티 피드백을 불러오는데 실패했습니다."); // 사용자에게 오류 알림
        }
    }

    const handleMentorFeedback = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + `mentor/feedback/${roomId}/${mentorId}`,
                {
                    content: userReview,
                    starRating: userScore,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            alert("멘토 피드백이 제출되었습니다!");
            navigate("/");
        } catch (error) {
            alert("멘토 피드백 작성에 실패했습니다. 다시 시도해 주세요");
        }
    };

    useEffect(() => {
        handleGetMenteeFeedback()
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Box color="#fff" height="100%" width="35vw" alignItems="flex-start" justify="flex-start" border="1px solid rgb(221, 221, 221)" radius="20px"
                 style={{ display: 'flex', boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.5'}}>
                <div style={{ marginBottom: '5px', width: '100%' }}>
                    <Font font="PretendardL" size="22px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                        {mentorNickname}의 피드백
                    </Font>
                </div>
                <Box height="57vh" width="30vw" border="none" alignItems="center" justify="start" top="10px" bottom="10px" style={{ display: 'flex' }}>
                    <Font font="PretendardB" size="18px" color="#000000" alignitem="flex-start" margintop="5px" spacing="2px" paddingtop="5px" marginbottom="8px">
                        <Box height="5vh" width="30vw" border="1px" alignItems="flex-start" justify="center" top="10px" bottom="10px" style={{ display: 'flex' }}>
                            목소리가 작네요.
                        </Box>
                        <Box height="5vh" width="30vw" border="1px" alignItems="flex-start" justify="" top="10px" bottom="10px" style={{ display: 'flex' }}>
                            자신감이 없어요.
                        </Box>
                    </Font>
                </Box>
                <Box height="28vh" width="30vw" border="none" alignItems="flex-start" justify="flex-start" top="10px" direction='column' bottom="10px" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Font font="PretendardB" size="18px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px" >
                                    멘토링 후기를 작성해주세요!
                                </Font>
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

                    <div style={{flexDirection: "column", justifyContent:"center"}}>
                        <textarea
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                            placeholder="리뷰를 입력해주세요..."
                            style={{ marginTop: '1rem',height:'16vh', width: '20vw', borderRadius: '8px', marginLeft: '4vw'}}
                        />
                        <Button
                            onClick={handleSubmitReview}
                            fontsize="20px"
                            radius="5px"
                            marginleft="25vw"
                            width="3vw"
                            margintop="5px"
                        >
                            제출
                        </Button>
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default InterviewFeedback;
