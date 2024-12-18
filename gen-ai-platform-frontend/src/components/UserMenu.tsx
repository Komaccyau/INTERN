/** @format */

import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { auth } from '../firebase/auth'; // authのインポート
import { signOut } from 'firebase/auth'; // signOutをインポート
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; // アイコンをインポート
import IconButton from '@mui/material/IconButton'; // IconButtonをインポート
import { useUser } from '../App';

interface UserMenuProps {
  currentPage: string; // 追加
}

const UserMenu: React.FC<UserMenuProps> = ({ currentPage }) => {
  const { userData, setUserData } = useUser();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // AccountCircleの位置を設定
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      setUserData(() => ({
        uid: null,
        chatData: [],
        nowChatId: null,
        messages: [],
      }));
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleChat = async () => {
    setUserData((prevData) => ({
      ...prevData,
      nowChatId: null,
      messages: [],
    }));
    navigate('/chat'); // チャット画面に遷移
  };

  const handlePrompt = async () => {
    try {
      const uid = userData.uid;
      navigate(`/prompt/${uid}`);
    } catch (error) {
      console.error('遷移エラー:', error);
    }
  };

  const handleProfileClick = () => {
    console.log('プロフィールを表示します');
    alert('プロフィールを表示します');
  };

  return (
    <>
      <IconButton
        component="span"
        onClick={handleMenuToggle}
        sx={{ color: 'white' }}>
        <AccountCircle fontSize="large" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // 影を追加
            borderRadius: '8px', // 角を丸める
          },
        }}>
        <MenuItem
          onClick={() => {
            handleProfileClick();
            handleMenuClose();
          }}>
          プロフィール
        </MenuItem>
        {currentPage === 'prompt' ? ( // プロンプト画面の場合
          <MenuItem
            onClick={() => {
              handleChat(); // チャットに遷移
              handleMenuClose();
            }}>
            チャット
          </MenuItem>
        ) : (
          // チャット画面の場合
          <MenuItem
            onClick={() => {
              handlePrompt(); // プロンプトに遷移
              handleMenuClose();
            }}>
            プロンプト
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleLogout();
            handleMenuClose();
          }}>
          ログアウト
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
