import React, {Component} from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, 
  AppBar, Toolbar, IconButton, Typography, InputBase, withStyles, alpha } 
  from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import User from '../components/User';
import '../App.css';

const styles = theme => ({
  root:{
    width:'100%',
    overflowX:"auto"
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    marginLeft: 18,
    marginRight: 18
  },
  progress: {
    margin: theme.spacing(2)
  },
  grow: {
    flexGrow: 1,
  },
  tableHead: {
    fontSize: '1.0rem'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  }
})

class UserManagePage extends Component{

  constructor(props){
    super(props);
    this.state = {
      users: '',
      completed: 0,
      searchKeyword: ''
    }
  }

  stateRefresh = () => {
    this.setState({
      users: '',
      completed: 0,
      searchKeyword: ''
    });
    this.callApi()
      .then(res => this.setState({users: res}))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 500);
    this.callApi()
      .then(res => this.setState({users: res}))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const config = {
      headers: {
        'Accept': 'application/json'
      }
    }

    const response = await fetch('/api/users/info', config);
    const body = await response.json();
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 10 })
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render(){ 
    // 사용자가 검색창에 입력한 검색값을 포함하고 있는 고객 데이터만 출력할 수 있도록
    // 화면에 고객 정보를 출력하는 부분을 따로 함수 형태로 명시
    
    const filteredComponents = (data) => {
        data = data.filter((c) => {
            return c.name.indexOf(this.state.searchKeyword) > -1;
        })

        return data.map((c) => {
            return <User stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birth={c.birth} userid={c.userid} userpw={c.userpw}/>
        })
    }

    const {classes}=this.props;
    const cellList = ["번호", "프로필 이미지", "이름", "생년월일", "아이디", "비밀번호", "설정"];
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              고객 관리
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="검색하기"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                name="searchKeyword"
                value={this.state.searchKeyword}
                onChange={this.handleValueChange}
                //값 입력하면 handleValueChange에 의해 searchKeyword라는 이름의 state값이
                //변경된 값으로 적용이 이루어지고, 그 value라는 속성에 의해 화면에 출력됨
              />
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.menu}>
        </div>
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
                <TableCell colSpan="6" align="center"> 
                <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
                </TableCell>
              </TableRow> }
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(UserManagePage);