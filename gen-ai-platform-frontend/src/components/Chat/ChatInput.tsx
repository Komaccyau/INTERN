/** @format */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';

interface ChatInputProps {
  addMessage: (text: string | '', image: File | null) => void;
  loading: boolean;
  setHasImage: (hasImage: boolean) => void; // 画像有無の状態を親コンポーネントに通知
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  addMessage,
  loading,
  setHasImage,
  className,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  const sendMessage = async (text: string, image: File | null) => {
    if (image) {
      addMessage(text.trim(), image);
    } else if (text.trim()) {
      addMessage(text, null);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !image) {
      alert('メッセージを入力してください。');
      return;
    }
    await sendMessage(inputText, image);
    resetInput();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
      setHasImage(true); // 画像が選択されたことを親コンポーネントに通知
    }
  };

  const resetInput = () => {
    setInputText('');
    setImage(null);
    setImagePreview(null);
    clearFileInput();
    setHasImage(false); // 画像が削除されたことを親コンポーネントに通知
  };

  const clearFileInput = () => {
    const fileInput = document.getElementById(
      'icon-button-file'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box className={className}>
      {imagePreview && (
        <Box m={1}>
          <IconButton
            component="span"
            onClick={() => {
              setImage(null);
              setImagePreview(null);
              clearFileInput();
              setHasImage(false); // プレビューを削除した際に親コンポーネントに通知
            }}
            style={{
              position: 'fixed',
              padding: 0,
            }}>
            <ClearIcon
              sx={{
                fontSize: 20,
                borderRadius: 15,
                border: '1.5px solid #ddd',
                color: '#fff',
                backgroundColor: '#000',
                '&:hover': {
                  backgroundColor: '#f00',
                },
              }}
            />
          </IconButton>
          <img
            src={imagePreview}
            alt="選択された画像"
            style={{
              maxWidth: '300px',
              maxHeight: '200px',
              borderRadius: '10px',
              margin: '10px',
            }}
          />
        </Box>
      )}
      <Box display="flex" justifyContent="center" m={1}>
        <TextField
          multiline
          maxRows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="メッセージを入力..."
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#000',
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton component="span">
                      <AttachFileIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                  </label>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          component="span"
          onClick={handleSend}
          disabled={loading}
          sx={{ backgroundColor: '#555', color: 'white', marginLeft: 1 }}>
          <SendIcon sx={{ fontSize: 35 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInput;
