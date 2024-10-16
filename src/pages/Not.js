import React from 'react';
import not from'../assets/not.png'

const Not = () => {
    return (
        <div style={{display:'flex', alignItems:'center', justifyItems:'center', width:"50vw", height:'60vh'}}>
        <img src={not} alt="Not Found" style={{ width: '100%', height: '100%' }} />
    </div>
    );
  }
  
export default Not;