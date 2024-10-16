import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '../components/Box';
import Button from '../components/Button';
import Font from '../components/Font';
import ReviewForm from '../components/ReviewForm ';
import axios from 'axios';

const InterviewFeedback = () => {
    const accessToken = localStorage.getItem('accessToken');
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const [submittedReviews, setSubmittedReviews] = useState([]); // 제출된 리뷰들
    const location = useLocation();
    const { roomId, mentorId } = location.state || {};
    const [mentorNickname, setMentorNickname] = useState('');
    const [content, setContent] = useState('');
    const [userScore, setUserScore] = useState(0); // 사용자 점수 상태
    const [userReview, setUserReview] = useState(''); // 사용자 리뷰 상태

    useEffect(() => {
        setHeaderMode('main');
        handleGetMenteeFeedback(); // 피드백 가져오기
    }, [setHeaderMode]);

    const handleSubmitReview = async (newReview) => {
        // 리뷰 추가
        setSubmittedReviews((prevReviews) => [...prevReviews, newReview]);

        // 피드백 API 호출
        await handleMentorFeedback(newReview);
    };

    const handleGetMenteeFeedback = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + `mentee/feedback/${roomId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 인증 헤더 설정
                }
            });

            if (response.data && response.data.data) {
                let data = response.data.data;
                setContent(data.content);
                setMentorNickname(data.mentorNickname);
            } else {
                console.error("Received unexpected response structure:", response.data);
            }
        } catch (error) {
            console.error("멘티 피드백을 불러오는 중 오류 발생:", error); // 오류 메시지 출력
            alert("멘티 피드백을 불러오는데 실패했습니다."); // 사용자에게 오류 알림
        }
    };

    const handleMentorFeedback = async (newReview) => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + `mentor/feedback/${roomId}/${mentorId}`,
                {
                    content: newReview.userComment,
                    starRating: newReview.score,
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

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box height="100%" width="35vw" border="none" alignItems="flex-start" justify="flex-start" style={{ display: 'flex' }}>
                <div style={{ marginBottom: '5px', width: '100%' }}>
                    <Font font="PretendardL" size="22px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                        {mentorNickname}의 피드백
                    </Font>
                </div>
                <Box height="57vh" width="30vw" border="none" alignItems="center" justify="center" top="10px" bottom="10px" style={{ display: 'flex' }}>
                    <Font font="PretendardB" size="18px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                        {content}
                    </Font>
                </Box>
                <Box height="28vh" width="30vw" border="none" alignItems="flex-start" justify="flex-start" top="10px" direction='column' bottom="10px" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0px', width: '100%' }}>
                        <Font font="PretendardB" size="18px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                            멘토링 후기를 작성해주세요!
                        </Font>
                    </div>

                    <ReviewForm
                        onSubmitReview={handleSubmitReview}
                        userScore={userScore}
                        setUserScore={setUserScore}
                        userReview={userReview}
                        setUserReview={setUserReview}
                    /> {/* ReviewForm 컴포넌트 사용 */}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ height: "20px", width: "30px" }}></div>
                        <Button
                            right="5px"
                            margintbottom="3px"
                            margintop="5px"
                            onClick={() => handleSubmitReview({ score: userScore, userComment: userReview })}
                            fontsize="20px"
                            radius="5px"
                        >
                            제출
                        </Button>
                    </div>
                </Box>
            </Box>
        </div>
    );
};

export default InterviewFeedback;
