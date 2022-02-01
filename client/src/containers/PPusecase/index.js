import { Box,Paper, Container, makeStyles, Backdrop, CircularProgress, FormControl, InputLabel, Select,MenuItem, Grid  } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import Toolbar from '../../components/Toolbar';
import Page from '../../components/Page';
import ReleaseNotes from '../../components/ReleaseNotes';
import api from '../../redux/api';
import { handle } from '../../utils/helpers';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import { FormGroup, FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ProjectSideBar from '../../components/ProjectSideBar';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';


const styles = {
    Container: {
        backdropFilter: 'blur(40px)',
    },

    Container3: {
        border: "1px solid #000000",
        boxSizing: "border-box",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        width: '100%',
        paddingRight: theme.spacing.unit * 7
    },
    toolbar: theme.mixins.toolbar,
}))

const ProjectPageBugs = props => {

    // const history = useHistory();

    const [values, setValues] = React.useState({
        name: "",
        title: "",
    });

    const [getdata , setGetdata] = React.useState([]);

    // const info = {
    //     name: Name,
    //     title: Title,
    // }

    // const PostData = async() => {
    // await axios.post(``, info);
    // history.push("/")
    // }
    
    useEffect(() => {
    const GetData = async() => {   
        const res = await axios.get(``);
        setGetdata(res.data);
    }
    GetData();
    },[])

    const [box, setBox] = React.useState(false);

    const pop = () => {
        setBox(true);
    }

    const popdown = () => {
        setBox(false);
    }

    const classes = useStyles()
   
    const [on, setOn] = React.useState(false);
    
    const onclk = ( ) => {
        setOn(!on);
    }

    const [projects, setProjects] = React.useState([]);
    const [bugs, setBugs] = React.useState([]);
    const [selected, setSelected] = React.useState(0);
    const params = useParams();
    const [cookies] = useCookies(['user']);
    const user = useSelector(state => state.authentication.user);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        if (params.id) {
            const config = {
                headers: { Authorization: `Bearer ${cookies.user.token}` }
            }
    
            const [result,error] = await handle(api.get(`/project/${params.id}`, config))

            if (!error) {
                const projects = result.data
                setProjects(projects)
            }
        }
    }

    const fetchBugs = async () => {
        if (selected < projects.length) {
            if (projects[selected].id) {
                const config = {
                    headers: { Authorization: `Bearer ${cookies.user.token}` }
                }
        
                const [result,error] = await handle(api.get(`/bugs/${projects[selected].id}`, config))
    
                if (!error) {
                    const bugs = result.data
                    setBugs(bugs)
                }
            }
        }
    }

    React.useEffect(() => {
        fetchBugs()
    }, [selected, projects])

    const handleChange = event => {
        setSelected(event.target.value)
    }
    
    React.useEffect(() => {
        fetchProjects()
    }, [params])

    React.useEffect(() => {
        if (user && user.licenseInfo === "unpaid" && user.daysRemaining === null) {
            navigate("/")
        }
    }, [user])

    return (
        <div style={{width: '100%'}}>
            <div className={classes.toolbar} />

            <Grid container justify="flex-start">
                <Grid item>
                    <ProjectSideBar fetch={fetchProjects} orientation="left" />
                </Grid>

                <Grid item xs={10}>
                    <Grid container justify="flex-end">
                        <Page className={classes.root} title="Bugs">
                            {/* <Backdrop style={{zIndex: 100, color: '#fff'}} open={loading}>
                                <CircularProgress color="inherit" />
                            </Backdrop> */}
                            
                            {/* <Container maxWidth={false}>
                                <Toolbar fetch={fetchBugs} projects={projects} handleChange={handleChange} selected={selected} />

                                <Box mt={3}>
                                     <ReleaseNotes bugs={bugs} />
                                </Box>
                            </Container> */}

<Container style={styles.Container} maxWidth="100%" className="cofbackground" >
<Box sx={{
    display: "flex",
    flexDirection: "column",
    height: 'max-content',
    alignItems: "center",
}} justifyContent="center">
     
        <Stack display="flex" direction="row" minWidth="80%" sx={{margin:"2% 0px"}} justifyContent="space-between">
        <Typography variant="h5" >Use Case Documents</Typography>
         <button className='btn btn-primary btn-gradient'
            style={{
                minWidth: "20%",
                padding: '10px',
                color: "white",
                backgroundColor: "#1A66CA",
                borderRadius: "5px"
            }} onClick={pop} >Add Use</button>
            </Stack>
     
     <Paper style={{minHeight:"70vh"}} >
     <Stack style={{minHeight:"70vh",margin: "10px"}} >

      <Typography>Name</Typography>   

      {getdata.map((value) => {
      return(
          <>
          <Typography>{value.name}</Typography>   
          </>
      )
      })}

     <hr></hr>
     </Stack>

     </Paper>

</Box>
{box ? <Paper style={{
    minWidth:"100%" ,
    minHeight:"80%" ,
    position: "fixed",
    top: '10%',
    left: "0.5%",
    borderRadius: '5px',
    flexDirection: "column",
    display: "flex",
    padding: "4% 4%",
}}>

<Stack spacing={3} >
<label><b>Name</b></label>
<TextField
value={values.name}
name="name"
id="name"
 />

<label><b>Text Content</b></label>
<TextField 
value={values.title}
name="title"
id="title"
multiline 
sx={{marginBottom:"30px"}}
 rows={5} />        


<Stack direction="row" >
<button className='btn btn-primary btn-gradient'
style={{
borderRadius: "5px",
minWidth: "30%",
margin: "5px auto",
padding: '10px',
backgroundColor: "#1A66CA",
color: "white"
}}
onClick={() => console.log(values)}>Submit</button>

<button className='btn btn-gradient'
style={{
borderRadius: "5px",
minWidth: "30%",
margin: "5px auto",
padding: '10px',
}} onClick={popdown} >Cancel</button>
</Stack>
</Stack>
</Paper>: null}
</Container>







                        </Page>
                    </Grid>
                </Grid>

                <Grid item>
                    <Sidebar orientation="right" />
                </Grid>
            </Grid>
        </div>
    )   
}

export default ProjectPageBugs;