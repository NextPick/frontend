import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Font from '../components/Font';

const AgreementBoxes = () => {
  const navigate = useNavigate();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  const handleCheck1 = () => setChecked1((prev) => !prev);
  const handleCheck2 = () => setChecked2((prev) => !prev);
  const handleCheck3 = () => setChecked3((prev) => !prev);

  // Use useEffect to update allChecked based on checked1 and checked2
  useEffect(() => {
    setAllChecked(checked1 && checked2);
  }, [checked1, checked2, checked3]);

  const handleNext = () => {
    if (allChecked) {
      navigate('/signupOption');
    }
  };

  return (
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>회원가입</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px' }}>|</span>
        <span style={subTitle}>이용 약관</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />

      <div style={boxWrapper}>
        <h3 style={sectionTitle}>*필수* NextPick 서비스 이용 약관</h3>
        <div style={boxContainer}>
          <div style={contentBox}>
            제1조 (목적) <br />
            이 약관은 NextPick 서비스(이하 "서비스")를 이용함에 있어 NextPick과 이용자(이하 "회원") 간의 권리와 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다. <br />
            <br />
            제2조 (이용 계약의 성립) <br />
            회원이 서비스 가입을 신청하고, NextPick이 이를 승낙함으로써 이용 계약이 성립됩니다. 회원은 서비스 이용 과정에서 본 약관에 대해 동의한 것으로 간주합니다. <br />
            <br />
            제3조 (회원의 의무) <br />
            회원은 서비스 이용과 관련하여 필요한 모든 정보를 정확하게 제공해야 합니다. <br />
            회원은 NextPick의 사전 승낙 없이 상업적 목적으로 서비스를 이용하거나, 서비스 내의 정보를 제3자에게 제공할 수 없습니다. <br />
            회원은 서비스를 이용함에 있어 법령 및 공공질서를 준수해야 하며, 약관에 위배되는 행위를 하지 않아야 합니다.
          </div>
        </div>
        <label style={checkboxLabel}>
          <input type="checkbox" style={checkbox} checked={checked1} onChange={handleCheck1} />
          동의하십니까?
        </label>
      </div>

      <div style={boxWrapper}>
        <h3 style={sectionTitle}>*필수* 개인정보 수집 및 이용 동의</h3>
        <div style={boxContainer}>
          <div style={contentBox}>
            제1조 (수집하는 개인정보 항목) <br />
            NextPick은 회원가입, 서비스 제공 등을 위해 아래와 같은 개인정보를 수집합니다: <br />
            <br />
            필수 정보: 이름, 이메일 주소, 비밀번호, 전화번호 <br />
            선택 정보: 성별, 나이, 위치 정보 <br />
            제2조 (개인정보의 수집 및 이용 목적) <br />
            회원관리: 서비스 이용에 따른 본인 확인, 개인 식별, 회원 가입 의사 확인 <br />
            서비스 제공: 맞춤형 서비스 제공, 공지사항 전달 <br />
            서비스 개선: 통계 분석 및 서비스 품질 개선을 위한 데이터 분석 <br />
            제3조 (개인정보의 보유 및 이용 기간) <br />
            회원의 개인정보는 회원 탈퇴 시 즉시 파기되며, 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.
          </div>
        </div>
        <label style={checkboxLabel}>
          <input type="checkbox" style={checkbox} checked={checked2} onChange={handleCheck2} />
          동의하십니까?
        </label>
      </div>

      <div style={boxWrapper}>
        <h3 style={sectionTitle}>*선택* 마케팅 정보 수신 동의</h3>
        <div style={boxContainer}>
          <div style={contentBox}>
            제1조 (마케팅 목적의 개인정보 수집 및 이용 동의) <br />
            NextPick은 회원에게 다양한 서비스 및 프로모션 정보를 제공하기 위해 회원의 이메일 주소와 휴대전화번호를 활용할 수 있습니다.  <br />
            회원은 이에 대해 동의를 거부할 수 있으며, 거부 시에도 서비스 이용에는 제한이 없습니다. <br />
            <br />
            제2조 (마케팅 정보의 종류) <br />
            이벤트 및 프로모션 정보 제공: 신규 서비스 출시, 할인 행사, 이벤트 등과 관련된 정보 <br />
            맞춤형 광고 제공: 회원의 이용 기록을 분석하여 관심사에 맞춘 광고 정보를 제공 <br />
            제3조 (동의 철회) <br />
            회원은 언제든지 마케팅 정보 수신 동의를 철회할 수 있으며, 철회 방법은 이메일 하단의 수신 거부 링크 또는 고객센터를 통해 가능합니다.
          </div>
        </div>
        <label style={checkboxLabel}>
          <input type="checkbox" style={checkbox} checked={checked3} onChange={handleCheck3} />
          동의하십니까?
        </label>
      </div>
      <button
        onClick={handleNext}
        style={{ ...nextButtonStyle, backgroundColor: allChecked ? '#E0EBF5' : '#FFF' }}
        disabled={!allChecked}
      >
        <Font
        font="Pretendard"
        size="20px"
        >
        다음
        </Font>
      </button>
    </div>
  );
};

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '5vh',
  height: '100vh',
  backgroundColor: '#FFF',
};

const titleContainer = {
  marginBottom: '-10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '900px',
  marginLeft: '20px',
};

const mainTitle = {
  fontWeight: 'Bold',
  fontSize: '26px',
};

const subTitle = {
  fontSize: '18px',
  marginTop: '10px',
};

const divider = {
  borderTop: '2px solid #A0A0A0',
  marginBottom: '40px',
};

const boxWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '800px',
  marginBottom: '50px',
};

const sectionTitle = {
  fontSize: '20px',
  marginBottom: '10px',
};

const boxContainer = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#E0EBF5',
  borderRadius: '20px',
  padding: '20px',
  height: '250px',
  width: '100%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const contentBox = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #B0B0B0',
  borderRadius: '10px',
  padding: '10px',
  overflowY: 'auto',
};

const checkboxLabel = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '20px',
  fontSize: '14px',
  width:"100%"
};

const checkbox = {
  marginRight: '5px',
  marginBottom: '0px',
  width:"5%"
};

const nextButtonStyle = {
  padding: '10px 15px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '16px',
  cursor: 'pointer',
  width:'5vw',
  display: 'flex',
  alignContent:'center',
  justifyContent:'center'


};

export default AgreementBoxes;
