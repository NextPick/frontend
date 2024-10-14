import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
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
    let roomId = 0; // 실제 값 할당 필요
    let mentorId = 0; // 실제 값 할당 필요
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
            const response = await axios.get(process.env.REACT_APP_API_URL + roomId,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            const data = response.data.data;
            setContent(data.content);
            setMentorNickname(data.mentorNickname);
        } catch (error) {
            alert("멘티 피드백을 불러오는데 실패했습니다.")
        }
    }

    const handleMentorFeedback = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/mentee/feedback/${roomId}/${mentorId}`,
                {
                    content: feedback,
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
        } catch (error) {
            alert("멘토 피드백 작성에 실패했습니다. 다시 시도해 주세요");
        }
    };

    useEffect(() => {
        handleGetMenteeFeedback()
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box height="100%" width="35vw" border="none" alignItems="flex-start" justify="flex-start" style={{ display: 'flex' }}>
                <div style={{ marginBottom: '5px', width: '100%' }}>
                    <Font font="PretendardL" size="22px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                        {mentorNickname} 피드백
                    </Font>
                </div>
                <Box height="57vh" width="30vw" border="none" alignItems="center" justify="center" top="10px" bottom="10px" style={{ display: 'flex' }}>
                    <Font font="PretendardB" size="18px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                        멘토링 후기를 작성해주세요!
                    </Font>
                </Box>
                <Box height="28vh" width="30vw" border="none" alignItems="flex-start" justify="flex-start" top="10px" direction='column' bottom="10px" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Font font="PretendardB" size="18px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
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

                    <ReviewForm onSubmitReview={handleSubmitReview} setUserReview={setUserReview} /> {/* ReviewForm 컴포넌트 사용 */}
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
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default InterviewFeedback;
