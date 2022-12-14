import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ATC1Aa1= ({currentSize, sizeViewHandler}) => {

  // style obj > sku property, obj of objs (SKUs as keys) > sku value obj contains key value pairs {quantity: 8, size: 'XS'}

  return (
    <div id="ATC1Aa1" onClick={(e) => {e.preventDefault(); sizeViewHandler()}}>
      {currentSize}
    </div>
  )
}

export default ATC1Aa1