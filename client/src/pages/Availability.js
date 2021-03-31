import React from 'react';
import Button from '@material-ui/core/Button'
import { ButtonGroup, makeStyles, Tab, TableHead } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
import { withStyles } from '@material-ui/core/styles';
import Form from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },

});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(time) {
  return { time };
}

const rows = [
  createData('2:00PM-2:15PM'),
  createData('2:15PM-2:30PM'),
  createData('2:30PM-3:00PM'),
  createData('3:15PM-3:30PM'),
  createData('3:30PM-4:00PM'),
  createData('4:00PM-4:15PM'),
  createData('4:15PM-4:30PM'),
  createData('4:30PM-5:00PM'),
];

function CheckboxE(){
  const [checked, setChecked] = React.useState(false)
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return(
    <div>
      <Checkbox
        checked={checked}
        indeterminate={checked[0] !== checked[1]}
        onChange={handleChange}
        color="secondary"
      />
    </div>
  )
}



function SingleTable() {
  const classes = useStyles();
  return (
    <form onSubmit={event => {event.preventDefault();console.log(event)}}>
     <TableContainer component={Paper}>
       <Table className={classes.table} aria-label="simple table">
         <TableHead>
           <TableRow>
             <TableCell>Time</TableCell>
             <TableCell align="left">Monday</TableCell>
             <TableCell align="left">Tuesday</TableCell>
             <TableCell align="left">Wednesday</TableCell>
             <TableCell align="left">Thursday</TableCell>
             <TableCell align="left">Friday</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
         {rows.map((row) => (
            <StyledTableRow key={row.time}>
              <StyledTableCell component="th" scope="row">
                {row.time}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
            </StyledTableRow>
          ))}
         </TableBody>
       </Table>
       </TableContainer>
       <Button variant="contained" type="submit">
          Submit
        </Button>

       </form>
  );
}

function Availability() {
  return (
    <div className="App">
      <header className="App-header">
        Pick your schedule :)
        <SingleTable>
        </SingleTable>  
             
      </header>
    </div>
   
  );
}

export default Availability;
