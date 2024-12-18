/** @format */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth } from './firebase/auth';
import Login from './pages/Login';
import Chat from './pages/Chat';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import Prompt from './pages/Prompt';

export interface Message {
  text: string;
  image?: string;
  role: string;
}

export interface ChatData {
  id: string;
  name: string;
}

interface UserData {
  uid: string | null;
  chatData: ChatData[]; // ここは必要に応じて型を定義してください
  nowChatId: string | null;
  messages: Message[]; // Message型の配列
}

interface UserContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

interface UserProviderProps {
  children: ReactNode; // childrenの型をReactNodeに指定
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // userはオブジェクトとして初期化
  const [userData, setUserData] = useState<UserData>({
    uid: null,
    chatData: [], // プロパティ名を修正,
    nowChatId: null,
    messages: [],
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Box>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/chat/:chatId"
              element={
                <PrivateRoute
                  element={<Chat />}
                  uid={auth.currentUser?.uid || ''}
                />
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute
                  element={<Chat />}
                  uid={auth.currentUser?.uid || ''}
                />
              }
            />
            <Route
              path="/prompt/:uid"
              element={
                <PrivateRoute
                  element={<Prompt />}
                  uid={auth.currentUser?.uid || ''}
                />
              }
            />
          </Routes>
        </Box>
      </BrowserRouter>
    </UserProvider>
  );
};

export { useUser };
export default App;
