import React from 'react'

import AlphaLogotypeIcon from '../assets/images/alpha-logotype.svg'

const LogotypeLink = () => {
    return (
      <a href="/" className="logotype">
        <img src={AlphaLogotypeIcon} alt="alpha logotype icon" />
        <span>alpha</span>
      </a>
    );
  };

export default LogotypeLink