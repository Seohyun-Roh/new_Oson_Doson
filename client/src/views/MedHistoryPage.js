import React, { Component } from 'react';
import axios from 'axios';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, withStyles } from '@material-ui/core';
import { withCookies } from 'react-cookie';

import MenuBar from '../components/MenuBar';
import AnimalLoad from '../components/AnimalLoad';
import MedHistory from '../components/MedHistory';

const styles = theme => ({
  pageContainer:{
    backgroundColor: '#eff0f2',
    height:'82vh'
  },
  root:{
    overflowX: 'auto',
    margin: '20px 70px 20px 70px'
  },
  paper: {
    marginLeft: 18,
    marginRight: 18
  },
  tableHead: {
    fontSize: '1.0rem'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  }
})

class MedHistoryPage extends Component {

    constructor(props){
        super(props);
        const { cookies } = props;
        this.state = {
          users: '',
          id: cookies.get('loginUser'),
          selectedAnimal: ''
        }
    }

    getSelectedAnimalName = (name) => {
        this.setState({
            selectedAnimal: name
        });
    }

    componentDidMount() {
        setTimeout(() => {
            axios.post('/api/med_history', {
                animal_name: this.state.selectedAnimal
            })
            .then((response) => {
                this.setState({
                    users: response.data
                })
            })
            .catch(err => console.log(err))
        }, 100);        
    }

    componentDidUpdate() {
        axios.post('/api/med_history', {
            animal_name: this.state.selectedAnimal
        })
        .then((response) => {
            this.setState({
                users: response.data
            })
        })
        .catch(err => console.log(err))
    }

    render() {
        const filteredComponents = (data) => {
            return data.map((c) => {
                return <MedHistory key={c.chart_num} chart_num={c.chart_num} chart_date={c.chart_date} chart_details={c.chart_details} h_num={c.h_num} classify={c.classify}/>
            })
        }

        const {classes}=this.props;
        const cellList = ["차트 번호", "진료 날짜", "진료 내용", "병원 이름", "분류(접종, 진료)"];

        return (
          <div>
            <MenuBar />
            <div className={classes.pageContainer}>
              <div className={classes.root}>
                <h1>진료 내역 조회 🐾</h1>
                <AnimalLoad getSelectedAnimalName={this.getSelectedAnimalName}/>
                <Paper>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        {cellList.map(c => {
                          return <TableCell className={classes.tableHead}>{c}</TableCell>
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.users ? 
                            filteredComponents(this.state.users) :
                        <TableRow>
                            <TableCell colSpan="6" align="center"></TableCell>
                        </TableRow> }
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </div>
          </div>
        )
    }
}


export default withCookies(withStyles(styles)(MedHistoryPage));