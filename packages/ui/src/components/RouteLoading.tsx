import React from 'react';

import FullPageLoading from './FullPageLoading';

export interface RouteLoadingProps {
  message?: string;
}

const RouteLoading: React.FC<RouteLoadingProps> = ({ message }) => {
  return <FullPageLoading message={message} />;
};

export { RouteLoading };
export default RouteLoading;

