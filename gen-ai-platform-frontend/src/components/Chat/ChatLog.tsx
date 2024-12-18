/** @format */

import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import '../../pages/Chat.css';
import { getToken } from '../../firebase/getToken';
import { getChatHistory } from '../../api';
import { useUser } from '../../App';

interface LogProps {
  height: string;
}

const Log: React.FC<LogProps> = ({ height }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const { userData, setUserData } = useUser();
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userData.messages]);

  useEffect(() => {
    const fetchChatHistory = async (chatId: string) => {
      try {
        const token = await getToken();
        if (token) {
          const response = await getChatHistory(token, chatId);
          const baseURL = import.meta.env.VITE_BASE_URL;
          const formattedMessages = response
            .map((msg: [any, string | null]) => {
              return {
                role: msg[0]?.role,
                text: msg[0]?.content,
                image:
                  typeof msg[1] === 'string'
                    ? `${baseURL}/images/${msg[1]}`
                    : null,
              };
            })
            .filter((msg: any) => msg.text || msg.image);

          setUserData((prevData) => ({
            ...prevData,
            messages: formattedMessages,
          }));
        } else {
          console.error('トークンを取得できませんでした。');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('履歴の取得に失敗しました:', error.response.data);
          alert('履歴の取得に失敗しました。');
        } else {
          console.error('履歴の取得に失敗しました:', error);
          alert('履歴の取得に失敗しました。');
        }
      }
    };

    if (userData.nowChatId) {
      fetchChatHistory(userData.nowChatId);
    } else {
    }
  }, [userData.nowChatId]);

  return (
    <Box
      height={height}
      px={3}
      sx={{
        overflowY: 'auto',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
    >
      <Box
        className="custom-scroll"
        style={{
          overflowY: 'auto',
          maxHeight: '100%',
        }}
      >
        {length === 0 && userData.messages.length === 0 ? (
          <Typography variant="body2" mt={5} style={{ textAlign: 'center' }}>
            メッセージはまだありません。
          </Typography>
        ) : (
          <Box>
            {userData.messages.map((msg, index) => (
              <Box
                key={index}
                py={1}
                display="flex"
                flexDirection="column"
                alignItems={
                  msg.role === 'user' || msg.role === 'message-error'
                    ? 'flex-end'
                    : 'flex-start'
                }
                my={2}
              >
                {msg.image && (
                  <Box mb={1} width="fit-content">
                    <img
                      src={msg.image}
                      alt="送信された画像"
                      onError={(e) => {
                        e.currentTarget.src = 'path/to/default/image.png';
                        console.error('Image failed to load:', msg.image);
                      }}
                      style={{
                        maxWidth: '300px',
                        maxHeight: '250px',
                        borderRadius: '15px',
                      }}
                    />
                  </Box>
                )}
                {msg.text && (
                  <Typography variant="body1" className={msg.role}>
                    {msg.text}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
        <div ref={endOfMessagesRef} />
      </Box>
    </Box>
  );
};

export default Log;
