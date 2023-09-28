// NavigationList.js
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const NavigationList = () => {
  return (
    <List>
      <ListItem button component={Link} to="/page1">
        <ListItemText primary="Page 1" />
      </ListItem>
      <ListItem button component={Link} to="/page2">
        <ListItemText primary="Page 2" />
      </ListItem>
      {/* Add more list items for other pages */}
    </List>
  );
};

export default NavigationList;
