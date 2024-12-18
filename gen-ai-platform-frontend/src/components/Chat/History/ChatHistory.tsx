import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../../firebase/getToken';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateNewChat, deleteChat } from '../../../api/index';
import { useUser } from '../../../App';

const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState('');

  const handleNewChat = () => {
    setUserData((prevData) => ({
      ...prevData,
      nowChatId: null,
      messages: [],
    }));
    navigate('/chat');
  };

  const handleHistoryItemClick = (chatId: string) => {
    setUserData((prevData) => ({
      ...prevData,
      nowChatId: chatId,
    }));
    navigate(`/chat/${chatId}`);
  };

  const handleEditClick = (index: number) => {
    setIsEditing(userData.chatData[index]['id']);
    setCurrentText(userData.chatData[index]['name']);
  };

  const handleSave = async (index: number) => {
    if (currentText) {
      const token = await getToken();
      if (!token) {
        alert('ユーザーがログインしていません。');
        return;
      }
      const data = {
        chat_id: userData.chatData[index]['id'],
        new_chat_name: currentText,
      };

      try {
        await updateNewChat(token, data);
        const updatedChats = [...userData.chatData];
        updatedChats[index]['name'] = currentText;
        setUserData((prevData) => ({
          ...prevData,
          chatData: updatedChats,
        }));
        setIsEditing(null);
      } catch (error) {
        alert('チャットの更新に失敗しました。');
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      handleSave(index);
    }
  };

  const handleDeleteChat = async (index: number) => {
    const token = await getToken();
    if (!token) {
      alert('ユーザーがログインしていません。');
      return;
    }
    const chat_id = userData.chatData[index]['id'];

    try {
      await deleteChat(token, chat_id);
      const updatedChats = userData.chatData.filter((_, i) => i !== index);
      setUserData((prevData) => ({
        ...prevData,
        chatData: updatedChats,
        nowChatId: null,
        messages: [],
      }));
      navigate('/chat');
    } catch (error) {
      alert('チャットの削除に失敗しました。');
    }
  };

  return (
    <Box className="chat-history" sx={{ flexDirection: 'column' }}>
      <Button
        variant="contained"
        onClick={handleNewChat}
        sx={{ backgroundColor: 'black', color: 'white', borderRadius: 2 }}
        className="button-style-history"
      >
        ＋New Chat
      </Button>
      <Typography variant="h6" className="history-title">
        Chat List
      </Typography>
      {userData.chatData.length === 0 ? (
        <Typography variant="body2" style={{ textAlign: 'center' }}>
          履歴はありません。
        </Typography>
      ) : (
        userData.chatData.map((chatData, index) => (
          <Box
            key={chatData.id}
            width="100%"
            marginBottom={3}
            display="flex"
            alignItems="center"
          >
            <Button
              onClick={() => {
                if (isEditing === null) {
                  handleHistoryItemClick(chatData.id);
                }
              }}
              disabled={isEditing !== null}
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                paddingX: 2,
                textAlign: 'left',
                backgroundColor: 'transparent',
                color: 'white',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'gray',
                  border: '1px solid gray',
                },
              }}
            >
              {isEditing === chatData.id ? (
                <input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onBlur={() => handleSave(index)}
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'white',
                    outline: 'none',
                  }}
                />
              ) : (
                <Typography
                  className="history-text"
                  sx={{ fontSize: ' 13px' }} // 文字の大きさを小さくする
                >
                  {chatData.name.length > 5
                    ? `${chatData.name.slice(0, 5)}...`
                    : chatData.name}
                </Typography>
              )}
            </Button>
            <IconButton
              component="span"
              sx={{ color: 'white' }}
              onClick={() => handleEditClick(index)}
            >
              <ModeIcon />
            </IconButton>
            <IconButton
              component="span"
              sx={{ color: 'white', marginLeft: 1 }}
              onClick={() => handleDeleteChat(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChatHistory;
