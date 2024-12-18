import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/auth'; // authのインポート

interface PrivateRouteProps {
  element: JSX.Element;
  uid: string; // uidをプロパティとして追加
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, uid }) => {
  const user = auth.currentUser; // 現在のユーザーを取得

  return user ? (
    React.cloneElement(element, { uid })
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
