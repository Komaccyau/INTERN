/** @format */

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Snackbar } from '@mui/material';
import { auth } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Login/Footer';
import { getChatId, getUid } from '../api';
import axios from 'axios';
import './Login.css';
import { useUser } from '../App'; // Appからインポート

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user; // userCredentialからユーザー情報を取得
      const token = await user.getIdToken();

      const uid = await getUid(token); // バックエンドからUIDを取得
      if (!uid) {
        throw new Error('UIDが取得できませんでした。');
      }
      const chatData = await getChatId(uid, token);
      setUserData((prevData) => ({
        ...prevData,
        uid,
        chatData,
      }));
      navigate('/chat'); // ここを修正
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('バックエンドエラー:', err.response?.data || err.message);
        setError('バックエンドからのレスポンスに問題があります。');
      } else {
        console.error('ログインエラー:', error);
        setError(
          'ログインに失敗しました。メールアドレスまたはパスワードを確認してください。'
        );
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin(email, password);
  };

  const renderInput = (
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    label: string
  ) => (
    <>
      <label className="label-style">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="input-style"
      />
    </>
  );

  return (
    <Box className="container">
      <h2 className="title">Sign in to GenAI Platform</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          {renderInput(
            'email',
            email,
            (e) => setEmail(e.target.value),
            'e-mailアドレス'
          )}
          {renderInput(
            'password',
            password,
            (e) => setPassword(e.target.value),
            'パスワード'
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="button-style">
            Login
          </button>
        </form>
      </div>
      <Footer />
      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      />
    </Box>
  );
};

export default Login;
