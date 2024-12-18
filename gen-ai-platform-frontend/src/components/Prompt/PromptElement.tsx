/** @format */

import { DeleteForever } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import '../../pages/Prompt.css';

type Props = {
  promptId: string;
  deletePromptId: (promptId: string) => void;
};

const PromptElement = (props: Props) => {
  const elementId = props.promptId;
  const [role, setRole] = useState<string>('system');

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleElementDelete = () => {
    props.deletePromptId(elementId);
  };

  return (
    <>
      <Card
        sx={{
          width: '100%',
          margin: '1px 0', // 各要素のマージンを設定
        }}>
        <CardHeader
          title={`prompt ID: ${elementId}`}
          action={
            <IconButton
              component="span"
              aria-label="settings"
              onClick={handleElementDelete}>
              <DeleteForever />
            </IconButton>
          }
        />
        <CardContent>
          <Typography>プロンプトID: {elementId}</Typography>

          <Select
            labelId="role-select-label"
            id="demo-simple-select"
            value={role}
            label="Role"
            onChange={handleRoleChange}
            fullWidth
            sx={{ marginBottom: '16px' }} // 下に余白を追加
          >
            <MenuItem value="system">system</MenuItem>
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="assistant">assistant</MenuItem>
          </Select>

          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            placeholder="プロンプトを入力してください"
            defaultValue=""
            fullWidth
            sx={{ marginBottom: '0px' }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', marginBottom: '13px' }}>
          <Button variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            OK
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default PromptElement;
