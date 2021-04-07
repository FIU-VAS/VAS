import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {Typography} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import {useState} from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    paper: {
        width: "100%",
        height: 350,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    listTitle: {
        margin: "0.5rem 0.5rem 0.5rem 1rem"
    }
}));

function not(a, b) {   
    b = b.map(element => element.value); 
    return a.filter((element) => b.indexOf(element.value) === -1);
}

function intersection(a, b) {
    b = b.map(element => element.value);
    return a.filter((element) => b.indexOf(element.value) !== -1);
}

export const  TransferList = React.forwardRef((props, ref) => {
    const {onChange, titleRight, titleLeft, available, value} = props;

    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const left = not(available, value);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, value);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        // setRight(right.concat(left));
        onChange(value.concat(left));
    };

    const handleCheckedRight = () => {
        // setRight(right.concat(leftChecked));
        onChange(value.concat(leftChecked));

        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        // setRight(not(right, rightChecked));
        onChange(not(value, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        // setRight([]);
        onChange([]);
    };
    
    const [searchText, setSearchText] = useState('')

    const customList = (items) => (
        <Paper className={classes.paper}>
             
            
            <List dense component="div" role="list">
                {items.map((element) => {
                    const labelId = `transfer-list-item-${element.value}-label`;

                    return (
                        <ListItem key={element.value} role="listitem" button onClick={handleToggle(element)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(element) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={element.label} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
            <Grid item xs={5}>
        <TextField variant="outlined" label="Search Volunteer" type="search" 
                onChange={e => {setSearchText(e.target.value)}} />
                <Typography variant="h6" className={classes.listTitle}>{titleLeft}</Typography>
                {customList(left.filter((element)=>{
                    return element.searchValue.some(value=>value.toLowerCase().indexOf(searchText.toLowerCase())===0)
                }))}
            </Grid>
            <Grid item xs={2}>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleAllLeft}
                        disabled={value.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <Typography variant="h6" className={classes.listTitle}>{titleRight}</Typography>
                {customList(value)}
            </Grid>
        </Grid>
    );
})
