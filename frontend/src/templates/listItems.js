import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

import { Link } from 'react-router-dom';


export const mainListItems = (
  <React.Fragment>
    <Link to="/"> 
      <ListItemButton>
        <ListItemIcon>
          <HomeIcon/>
        </ListItemIcon>
          <ListItemText primary="Home" />
      </ListItemButton>
    </Link>

    <Link to="/create">
      <ListItemButton>
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
          <ListItemText primary="新規作成" />
      </ListItemButton>
    </Link>

    <Link to="/mypost">
      <ListItemButton>
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
          <ListItemText primary="自分の投稿" />
      </ListItemButton>
    </Link>

    <Link to="/all-user-post">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
          <ListItemText primary="みんなの投稿" />
      </ListItemButton>
    </Link>

  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>

    <ListSubheader component="div" inset>
    アカウント
    </ListSubheader>

    <Link to="/setting">
      <ListItemButton>
        <ListItemIcon>
            <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="設定" />
      </ListItemButton>
    </Link>

  </React.Fragment>
);
