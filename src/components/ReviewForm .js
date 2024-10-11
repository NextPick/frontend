import React, { useState } from 'react';
import Button from './Button'; // Button 컴포넌트 임포트
import Font from './Font'; // Font 컴포넌트 임포트
import Input from '../components/Input'

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

    // 글자 수 제한을 적용한 handleChange 함수 정의
    const handleChange = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 70) { // 글자 수가 70자 이하인 경우에만 업데이트
            setUserReview(inputText);
        }
    };
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}> {/* 수평 정렬 */}
                <Input
                    $w_fontSize="9px"
                    type="text"
                    $w_width="26vw"
                    $w_height="15vh"
                    marginBottom='-3px'
                    marginTop="0px"
                    value={userReview}
                    onChange={handleChange} // 글자 수 제한 핸들러 사용
                    placeholder="리뷰를 입력하세요 (최대 70자)"
                    radius='10px'
                    style={{ flex: 1, padding: '13px', border: '1px solid #ccc' }}
                />
            </div>


        </div>

    );
};

export default ReviewForm;
