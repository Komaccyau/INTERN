/** @format */

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  styled,
  Toolbar,
  List,
  Divider,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from '../components/UserMenu';
import ChatHistory from '../components/Chat/History/ChatHistory';
import '../pages/Chat.css';
import { Message } from '../App';

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  history: Message[];
  currentPage: string;
}

const drawerWidth = 250;

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ open }) => ({
  marginLeft: open ? 0 : `-${drawerWidth}px`,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ open }) => ({
  marginLeft: open ? `${drawerWidth}px` : 0,
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
}));

const DrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#3d3d3d',
});

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar className="page-header">
          <IconButton
            component="span"
            onClick={() => setOpen(true)}
            sx={{ display: open ? 'none' : 'flex', color: 'white' }}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ textAlign: 'center', flexGrow: 1, color: 'white' }}>
            chatGPT
          </Typography>
          <UserMenu currentPage={currentPage} />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
        variant="persistent"
        open={open}>
        <Box className="custom-scroll chat-history">
          <DrawerHeader>
            <IconButton
              component="span"
              onClick={() => setOpen(false)}
              sx={{ margin: 1, color: 'white' }}>
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          </DrawerHeader>
          <ChatHistory />
          <Divider />
          <List />
        </Box>
      </Drawer>
      <Main open={open} />
    </>
  );
};

export default Header;
