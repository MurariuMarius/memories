import React , {useEffect, useState} from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { getPosts, getFilteredPosts } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';

import useStyles from './styles';

const Home = () => {
  
  const classes = useStyles();
  const [search, setSearch] = useState('');

  const [query, setQuery] = useState('');

  const searchPost = () => {
    if(search.trim()){
      setQuery(search);
    }
  }

  const handleKeyPress = (e) => {
    if(e.key == "Enter"){
      searchPost();
    }
  }

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer} >
          <Grid item xs={12} sm={6} md={9}>
            {
              query.length ?
              <Posts fetchPosts={() => getFilteredPosts(query.trim())} /> :
              <Posts fetchPosts={() => getPosts()} />
            }
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit" >
                 <TextField nme="search" variant="outlined" label="Search Memories" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)}/>
                 <Button onClick={searchPost} className={classes.searchButton} color="primary" variant="contained">Search</Button>
            </AppBar>
            <Form />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;