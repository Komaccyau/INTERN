import { useState } from 'react';
import PromptElement from './PromptElement';
import List from '@mui/material/List';
import Button from '@mui/material/Button';

const PromptList = () => {
  const [dummyId, setDummyId] = useState<number>(0);
  const [promptIds, setPromptIds] = useState<string[]>([]);

  const handleElementAddButtonClick = () => {
    setDummyId(dummyId + 1);
    setPromptIds((prev) => [...prev, `${dummyId}`]);
  };

  const deletePromptId = (promptId: string) => {
    const filteredPromptIds = promptIds.filter((id) => id !== promptId);
    setPromptIds(filteredPromptIds);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '40px',
          marginBottom: '8px', // マージンを狭く設定
          marginLeft: '8%',
        }}
      >
        <h1 className="prompt-list-title" style={{ margin: 0, color: 'black' }}>
          Prompt Create
        </h1>
        <Button
          className="new-prompt-button"
          onClick={handleElementAddButtonClick}
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'white',
            color: 'white',
            backgroundColor: 'black',
          }}
          style={{ marginLeft: '40px' }}
        >
          +新しいプロンプトを作る
        </Button>
      </div>
      <List
        sx={{
          width: '90%',
          maxWidth: 10000,
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: '500px', // 最大高さを設定
          '& ul': { padding: 0 },
          margin: 'auto',
          paddingBottom: '20px',
        }}
      >
        {promptIds.length === 0 ? (
          <p style={{ marginLeft: '0%' }}>　　プロンプトがありません。</p>
        ) : (
          promptIds.map((promptId, index) => (
            <PromptElement
              key={index}
              promptId={promptId}
              deletePromptId={deletePromptId}
            />
          ))
        )}
      </List>
    </>
  );
};

export default PromptList;
