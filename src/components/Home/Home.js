import React , {useEffect, useState} from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import { useDispatch } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';

import useStyles from './styles';

const Home = () => {

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);


  const searchPost = () => {
    if(search.trim() || tags){
      //fetch search posts

      dispatch(getPostsBySearch({search, tags: tags.join(',')}));
      
    }
  }

  const handleKeyPress = (e) => {
    if(e.keyCode === 13){
      //search post
      searchPost();
    }
  }

const handleAdd = (tag) => setTags([... tags, tag]);
const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer} >
          <Grid item xs={12} sm={6} md={9}>
            <Posts fetchPosts={() => getPosts()} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit" >
                 <TextField nme="search" variant="outlined" label="Search Memories" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)}/>
                 <ChipInput
                    style={{margin: '10px 0'}}
                    value={tags}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    label="Search Tags"
                    variant="outlined"
                 />
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