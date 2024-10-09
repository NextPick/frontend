import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // 별점 아이콘
import Button from './Button'; // Button 컴포넌트 임포트
import Font from './Font'; // Font 컴포넌트 임포트

const ReviewForm = ({ onSubmitReview }) => {
    const [userScore, setUserScore] = useState(0); // 사용자 점수 상태
    const [userReview, setUserReview] = useState(''); // 사용자 리뷰 상태

    const handleSubmitReview = () => {
        // 새로운 리뷰와 점수를 제출
        if (userReview && userScore > 0) {
            const newReview = {
                score: userScore,
                userComment: userReview,
            };
            onSubmitReview(newReview); // 부모 컴포넌트로 리뷰 전송
            setUserReview(''); // 리뷰 입력 필드 초기화
            setUserScore(0); // 별점 초기화
        }
    };

    return (
        <div>
            {/* 리뷰 입력 폼 */}
            <div style={{ margin: '20px 0' }}>
                <Font font="PretendardL" size="10px" color="#000000" marginbottom="5px">
                    튜터링의 평가
                </Font>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', marginRight: '10px' }}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <FaStar
                                key={index}
                                size={20}
                                color={index < userScore ? '#FFD700' : '#e4e5e9'}
                                onClick={() => setUserScore(index + 1)} // 클릭 시 별점 설정
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <input
                        type="text"
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)} // 리뷰 텍스트 업데이트
                        placeholder="리뷰를 입력하세요"
                        style={{ flex: 1, padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <Button onClick={handleSubmitReview}>제출</Button>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
