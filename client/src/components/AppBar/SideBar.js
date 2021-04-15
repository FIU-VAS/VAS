import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import {grey, green} from '@material-ui/core/colors';
import HomeIcon from '@material-ui/icons/Home';
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import Logout from "./Logout";

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
    menu: {
        background: grey[900],
    },
    drawerPaper: {
        background: grey[900],
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    links: {
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
        link: "/availability",
        allowed: ["volunteer", "schoolPersonnel"]
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
    }
]


function ResponsiveDrawer(props) {
    const {window} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const user = useSelector(state => state.userData.user);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const location = useLocation().pathname;

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <div className={classes.menu}>
      <List>
      <Link to="/">
        <ListItem><HomeIcon fontSize="large" style={{ color: green[500], fontSize: 50}}/></ListItem>
         </Link>
        {routes.filter((route) => route.allowed.indexOf(user.role) !== -1).map(route=> (
        <Link className={classes.links} to={route.link} key={`${route.link}`}>
          <ListItem>
            <ListItemText style={{'color':(location===route.link?'#57C965':'white')}}>{route.title}</ListItemText>
          </ListItem>
        </Link>))}
          <Logout class={classes.links}/>
      </List>
      </div>

    </div>
  );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon/>
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
