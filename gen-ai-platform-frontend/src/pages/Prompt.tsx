/** @format */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { Box } from '@mui/material';
import PromptList from '../components/Prompt/PromptList';
import Header from '../components/Header'; // Headerをインポート
import './MainPage.css';
import './Prompt.css';
import { Message } from '../App';

const Prompt = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // 修正：isOpenとsetIsOpenを正しく定義
  const [history] = useState<Message[]>([
    // Message[]に変更
    { text: 'Title 1', role: 'system' }, // roleを適切に設定
    { text: 'Title 2', role: 'system' },
  ]);
  const [currentPage] = useState('prompt');

  return (
    <Box className="prompt-wapper">
      <Box className="prompt-container" sx={{ padding: '0 16px' }}>
        <Header
          navigate={navigate}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          history={history}
          currentPage={currentPage}
        />
        <Box className="prompt-create-container">
          <PromptList />
        </Box>
      </Box>
    </Box>
  );
};

export default Prompt;
