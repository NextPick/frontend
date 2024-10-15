import React, { createContext, useContext, useState, useEffect } from 'react';

// MemberContext를 생성합니다. 초기값은 undefined로 설정합니다.
const MemberContext = createContext(undefined);

// MemberManager 컴포넌트를 정의합니다. 자식 컴포넌트를 받아서 Provider로 감싸는 역할을 합니다.
export const MemberManager = ({ children }) => {
  // 상태를 정의합니다.
  const [authorization, setAuthorization] = useState(null); // 인증 토큰
  const [refresh, setRefresh] = useState(null); // 리프레시 토큰
  const [login, setLogin] = useState(null); // 로그인 상태
  const [name, setName] = useState(null); // 사용자 이름
  const [profileUrl, setProfileUrl] = useState(null); // 프로필 이미지 URL
  const [nickname, setNickname] = useState(null); // 사용자 닉네임
  const [phone, setPhone] = useState(null); // 사용자 전화번호
  const [email, setEmail] = useState(null); // 사용자 이메일
  const [type, setType] = useState(null)
  // const [roles, setRoles] = useState(null); // 역할 상태 추가


  // 사용자 정보 한 번에 업데이트하는 함수 추가
  const setProfileData = (profile) => {
    setName(profile.name || null);
    setProfileUrl(profile.profileUrl || null);
    setNickname(profile.nickname || null);
    setPhone(profile.phone || null);
    setEmail(profile.email || null);
    setAuthorization(profile.authorization || null);
    setRefresh(profile.refresh || null);
    setLogin(profile.login !== undefined ? profile.login : null);
    setType(profile.type || null);
    // setRoles(profile.roles || null);
  };

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 데이터를 가져옵니다.
  useEffect(() => {
    const storedAuthorization = localStorage.getItem('authorization');
    const storedRefresh = localStorage.getItem('refresh');
    const storedLogin = localStorage.getItem('login');
    const storedName = localStorage.getItem('name');
    const storedProfileUrl = localStorage.getItem('profileUrl');
    const storedNickname = localStorage.getItem('nickname');
    const storedPhone = localStorage.getItem('phone');
    const storedEmail = localStorage.getItem('email');
    const storedType = localStorage.getItem('type');
    // const storedRoles = localStorage.getItem('roles');


    // 가져온 데이터를 상태에 설정합니다.
    setAuthorization(storedAuthorization);
    setRefresh(storedRefresh);
    setLogin(storedLogin === 'true' ? true : storedLogin === 'false' ? false : null);
    setName(storedName);
    setProfileUrl(storedProfileUrl);
    setNickname(storedNickname);
    setPhone(storedPhone);
    setEmail(storedEmail);
    setType(storedType);
    // setRoles(storedRoles);
  }, []); // 빈 배열을 주어 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  // 상태가 변경될 때마다 로컬 스토리지에 저장합니다.
  // useEffect(() => {
    // if (authorization !== null) {
    //   localStorage.setItem('authorization', authorization);
    // } else {
    //   localStorage.removeItem('authorization');
    // }

    // if (refresh !== null) {
    //   localStorage.setItem('refresh', refresh);
    // } else {
    //   localStorage.removeItem('refresh');
    // }

    // if (login !== null) {
    //   localStorage.setItem('login', login.toString());
    // } else {
    //   localStorage.removeItem('login');
    // }
    
    // if (name !== null) {
    //   localStorage.setItem('name', name);
    // } else {
    //   localStorage.removeItem('name');
    // }

    // if (profileUrl !== null) {
    //   localStorage.setItem('profileUrl', profileUrl);
    // } else {
    //   localStorage.removeItem('profileUrl');
    // }

    // if (nickname !== null) {
    //   localStorage.setItem('nickname', nickname);
    // } else {
    //   localStorage.removeItem('nickname');
    // }

    // if (phone !== null) {
    //   localStorage.setItem('phone', phone);
    // } else {
    //   localStorage.removeItem('phone');
    // }

    // if (email !== null) {
    //   localStorage.setItem('email', email);
    // } else {
    //   localStorage.removeItem('email');
    // }
  // }, [authorization, refresh, login, name, profileUrl, nickname, phone, email]);

  // MemberContext.Provider를 통해 상태와 상태 업데이트 함수를 자식 컴포넌트에 제공합니다.
  return (
    <MemberContext.Provider value={{ 
      authorization, setAuthorization, 
      refresh, setRefresh, 
      login, setLogin, 
      name, setName, 
      profileUrl, setProfileUrl, 
      nickname, setNickname, 
      phone, setPhone, 
      email, setEmail, 
      type, setType,
      // roles, setRoles,
      setProfileData // 새로운 함수 제공
    }}>
      {children}
    </MemberContext.Provider>
  );
};

// useMember 훅: MemberContext에서 사용자 정보를 가져오는 커스텀 훅입니다.
export const useMember = () => {
  const context = useContext(MemberContext); // MemberContext에서 현재 context를 가져옵니다.
  if (context === undefined) {
    throw new Error('MemberContext를 찾을 수 없습니다.');
  }
  return context; // context를 반환하여 사용자가 필요한 값에 접근할 수 있게 합니다.
};
