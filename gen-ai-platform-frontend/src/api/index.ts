import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const getUid = async (token: string) => {
  try {
    const response = await api.get('/login', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.uid;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw error;
  }
};

export const sendMessage = async (token: string, formData: FormData) => {
  try {
    const response = await api.post('/chat', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.response.result;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw error;
  }
};

export const getChatId = async (uid: string, token: string) => {
  try {
    const response = await api.get(`/chat-rooms/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.rooms;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('chat_idの取得に失敗しました:', error.message);
    } else {
      console.error('予期しないエラー:', error);
    }
    throw error;
  }
};

export const getChatHistory = async (token: string, room_id: string) => {
  try {
    const response = await api.get(`/chat-history/${room_id}`, {
      params: { room_id: { room_id } },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.messages;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw error;
  }
};

export const createChat = async (token: string, formData: FormData) => {
  try {
    const response = await api.post('/new-chat', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.response;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw error;
  }
};

export const updateNewChat = async (
  token: string,
  data: { chat_id: string; new_chat_name: string }
) => {
  const requestData = {
    chat_id: data.chat_id,
    new_chat_name: data.new_chat_name,
  };

  try {
    const response = await api.post('/update-room-name', requestData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.response;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw error;
  }
};

export const deleteChat = async (token: string, chat_id: string) => {
  try {
    const response = await api.delete(`/chat/${chat_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw error;
  }
};
