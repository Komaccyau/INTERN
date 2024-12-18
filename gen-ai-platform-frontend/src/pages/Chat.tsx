/** @format */

import React, { useState } from 'react';
import Header from '../components/Header';
import { getToken } from '../firebase/getToken';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Log from '../components/Chat/ChatLog';
import ChatInput from '../components/Chat/ChatInput';
import axios from 'axios'; // axiosをインポート
import './Chat.css';
import { sendMessage, createChat } from '../api'; // 送信メッセージ用API
import { useUser, Message } from '../App'; // Appからインポート

const Chat: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userData, setUserData } = useUser();
  const history = userData.messages || [];
  const [currentPage] = useState('chat');
  const navigate = useNavigate(); // useNavigateをここで呼び出す

  const addMessage = async (inputText: string, image: File | null) => {
    const token = await getToken(); // トークンを取得
    if (!token) {
      alert('ユーザーがログインしていません。');
      return;
    }
    const chatId = userData.nowChatId;
    const aiModel = 'gpt-4o-mini-2024-07-18';

    if (inputText.trim() || image) {
      setLoading(true);

      const newMessage: Message = {
        text: inputText.trim(),
        image: image ? URL.createObjectURL(image) : undefined,
        role: 'user',
      };
      setUserData((prevData) => ({
        ...prevData,
        messages: [...prevData.messages, newMessage],
      }));

      try {
        if (chatId) {
          const formData = new FormData();
          const dataPayload = {
            chat_id: chatId,
            ai_model: aiModel,
            message: {
              role: 'user',
              content: inputText.trim(),
            },
          };

          formData.append('data', JSON.stringify(dataPayload));
          if (image) {
            formData.append('file', image);
          }

          const response = await sendMessage(token, formData); // トークンとFormDataを渡す

          const botMessage: Message = {
            text: response.content,
            role: response.role,
          };
          setUserData((prevData) => ({
            ...prevData,
            messages: [...prevData.messages, botMessage],
          }));
        } else {
          const formData = new FormData();
          const dataPayload = {
            uid: userData.uid,
            ai_model: aiModel,
            message: {
              role: 'user',
              content: inputText.trim(),
            },
          };

          formData.append('data', JSON.stringify(dataPayload));
          if (image) {
            formData.append('file', image);
          }

          const response = await createChat(token, formData); // トークンとFormDataを渡す
          const chatData = response.chat_data;
          const nowChatId = chatData['id'];
          setUserData((prevData) => ({
            ...prevData,
            chatData: [...prevData.chatData, chatData],
            nowChatId: nowChatId,
          }));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            'メッセージ送信に失敗しました:',
            error.response?.data || error.message
          );
          const errorMessage: Message = {
            text: 'メッセージ送信に失敗しました',
            role: 'message-error',
          };
          setUserData((prevData) => ({
            ...prevData,
            messages: [...prevData.messages, errorMessage],
          }));
        } else {
          console.error('メッセージ送信に失敗しました:', error);
          const errorMessage: Message = {
            text: 'メッセージ送信に失敗しました',
            role: 'message-error',
          };
          setUserData((prevData) => ({
            ...prevData,
            messages: [...prevData.messages, errorMessage],
          }));
        }
      } finally {
        setLoading(false);
      }
    } else {
      alert('メッセージを入力してください。');
    }
    if (image) {
      setHasImage(true);
      setTimeout(() => {
        setHasImage(false);
      }, 100);
    } else {
      setHasImage(false);
    }
  };

  return (
    <Box className="chat-wapper">
      <Box className="chat-container">
        <Header
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          navigate={navigate}
          history={history}
          currentPage={currentPage}
        />

        <Box className="chat-log-container">
          <Log height={hasImage ? '50vh' : '80vh'} />
          <ChatInput
            addMessage={addMessage}
            loading={loading}
            setHasImage={setHasImage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
