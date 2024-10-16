import { postData } from './index.js'; // 필요한 파일 경로로 수정하세요.

const BASED_URL = process.env.REACT_APP_BASED_URL;
const REGISTER_URL = BASED_URL + '/members';


export const postMember = async (email, password, nickName, authCode) => {
    const response = await postData(process.env.REACT_APP_API_URL + 'api/mypage', { email, password, nickName, authCode });
    return response;
};