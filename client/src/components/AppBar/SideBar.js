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
import {useRouteMatch} from "react-router-dom";
import {useSelector} from "react-redux";

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

const routes = [
  {
    title: "Profile",
    link: "/profile",
    allowed: ["admin", "volunteer", "schoolPersonnel"]
},
{
  title: "Dashboard",
  link: "/dashboard",
  allowed: ["admin", "volunteer", "schoolPersonnel"]
},
{
  title: "Availability",
  link:"/availability",
  allowed: [ "volunteer", "schoolPersonnel"]
},
{
  title: "Settings",
  link: "/settings",
  allowed: ["admin"]
},

  {
      title: "Admins",
      link: "/admin-management",
      allowed: ["admin"]
  },
  {
    title: "Personnels",
    link: "/school-personnel-management",
    allowed: ["admin"]
},
{
  title: "Schools",
  link: "/schoolmanagement",
  allowed: ["admin"]
},
  {
      title: "Volunteers",
      link: "/volunteer-management",
      allowed: ["admin"]
  },
  
  {
      title: "Teams",
      link: "/team-management",
      allowed: ["admin"]
  },
  {
    title: "About",
    link: "/about",
    allowed: ["admin", "volunteer", "schoolPersonnel"]
  },
  {
    title: "Log Out",
    link:"/",
    allowed: ["admin", "volunteer", "schoolPersonnel"]
  }
  
]


function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  let {url} = useRouteMatch();
  const user = useSelector(state => state.userData.user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <div className={classes.menu}>

       <Link to="/" >
         <img
            src ={require("../../images/VAS_LOGO.png").default}
            alt = "logo"
            height = "70px"
         />
        </Link> 
      <Divider />
      <List>
        {routes.filter((route) => route.allowed.indexOf(user.role) !== -1).map(route=> (
        <Link className={classes.links} to={route.link} key={`${route.link}`}> 
          <ListItem> 
            <ListItemText>{route.title}</ListItemText>
          </ListItem> 
        </Link>))} 
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
