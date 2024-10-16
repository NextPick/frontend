폴더의 용도
=============
- 재사용 가능한 컴포넌트들이 위치하는 폴더입니다.
- 컴포넌트가 많아질 수 있기 때문에 이 폴더 내부에서 하위 폴더로 추가로 분류하는것이 좋습니다.
- Template
```
import React from 'react';
import '../styles/global.css';  
import { Link } from 'react-router-dom';  

const Template = () => {
    return (
        <div>
        </div>
    );
}

export default Template;
```