import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { grey } from '@material-ui/core/colors';
import config from "../../config";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import { green } from '@material-ui/core/colors';
import HomeIcon from '@material-ui/icons/Home';
import { connect } from 'react-redux';

const drawerWidth = 110;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    }  
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    background: grey[900],
    
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',    
    },
    
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  menu:{
      textAlign: 'center',
      background: grey[900],
  },
  drawerPaper: {
    background: grey[900],
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  links:{
    color: 'white',
    textDecoration: 'none',
    "&:hover": {
      color: "#57C965"
    },
    '&:selected': {
      color: "#57C965"
    }
  },
}));



function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <div className={classes.menu}>
      <Link to="/" >
        <ListItem><HomeIcon fontSize="large"  style={{ color: green[500] }}/></ListItem>
        
         </Link>
      <Divider />
      <List>
       <Link to='/dashboard' className={classes.links}>
       <ListItem> 
          <ListItemText>Dashboard</ListItemText>
          </ListItem> 
        </Link> 
        
        <Link to='/profile' className={classes.links}> 
          <ListItem> 
            <ListItemText>Profile</ListItemText>
          </ListItem> 
        </Link>
        {config.userRoles.admin === 'admin' &&
        <Link to='/availability' className={classes.links}> 
          <ListItem> 
            <ListItemText>Availability</ListItemText>
          </ListItem> 
        </Link>}
        {config.userRoles.admin === 'admin' &&
        <Link to='/settings' className={classes.links}> 
          <ListItem> 
            <ListItemText>Settings</ListItemText>
          </ListItem> 
        </Link>}
        {config.userRoles.admin === 'admin'  &&
        <Link to='/admin-management' className={classes.links}> 
          <ListItem> 
            <ListItemText>Admins</ListItemText>
          </ListItem> 
        </Link>}
        {config.userRoles.admin === 'admin'  &&
        <Link to='/school-personnel-management' className={classes.links}> 
          <ListItem> 
            <ListItemText>Personnel</ListItemText>
          </ListItem> 
        </Link>}
        {config.userRoles.admin === 'admin'  &&
        <Link to='/schoolmanagement' className={classes.links}> 
          <ListItem> 
            <ListItemText>Schools</ListItemText>
          </ListItem> 
        </Link>}
        {config.userRoles.admin === 'admin'  &&
        <Link to='/volunteer-management' className={classes.links}> 
          <ListItem> 
            <ListItemText>Volunteers</ListItemText>
          </ListItem> 
        </Link>}
        {config.userRoles.admin === 'admin'  &&
        <Link to='/team-management' className={classes.links}> 
          <ListItem> 
            <ListItemText>Teams</ListItemText>
          </ListItem> 
        </Link>}
        <Link to='/about' className={classes.links}> 
          <ListItem> 
            <ListItemText>About</ListItemText>
          </ListItem> 
        </Link>
        <Link to='/' className={classes.links}>
           {/* onClick={this.submitLogout}>  */}
          <ListItem> 
            <ListItemText>Log out</ListItemText>
          </ListItem> 
         <ListItem>
         <img
            src ={require("../../images/VAS_LOGO.png").default}
            alt="logo"
            height = "70px"
         />
         </ListItem>
        </Link>
        
      </List>
      </div>
           
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
       
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
         
        
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
     
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
