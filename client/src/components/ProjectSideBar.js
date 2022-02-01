import React,{ useContext, useState } from 'react';
import { makeStyles,Drawer, Divider, IconButton, Grid, Typography, Dialog, DialogTitle, TextField, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import { handle } from '../utils/helpers';
import api from '../redux/api';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { useForm } from 'react-hook-form';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';


const useStyles = makeStyles((theme) => ({
    drawer: {
        zIndex: 3,
        position: 'relative',
        flexShrink: 0,
        width: 180
    },
    toolbar: theme.mixins.toolbar,
    paper: {
        width: 180,
    }
}))

const ProjectSideBar = ({orientation, fetch}) => {

    const classes = useStyles();
    const params = useParams();
    const [cookies] = useCookies(['user']);
    // const [projects, setProjects] = React.useState([
    //     {projectName: "Docs"},
    //     {projectName: "Tasks"},
    //     {projectName: "Bugs"},
    // ]);
    const [projects, setProjects] = React.useState(true);
    const drop = () => {
        setProjects(!projects);
    }

    const [open, setOpen] = React.useState(false);
    const { register, handleSubmit, formState: {errors},reset, control} = useForm();
    const [createErros, setErrors] = React.useState(false);
    const user = useSelector(state => state.authentication.user);

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

    const createProject = async ({projectName, projectDescription}) => {

      


        if (params.id && user && user.id) {
            const config = {
                headers: { Authorization: `Bearer ${cookies.user.token}` }
            }

            const [result,error] = await handle(api.post(`/project`, {
                projectName,
                description: projectDescription,
                createdBy: user.id,
                companyId: params.id
            }, config))

            if (!error) {
                await fetchProjects();
                await fetch();
                setOpen(false)
                setErrors(false)
            } else {
                setErrors(true)
            }
        }
    }

    const handleClose = () => {
        setOpen(false)
        setErrors(false)
    };

    React.useEffect(() => {
        fetchProjects()
    }, [params])

    const onSubmit = data => {
        createProject(data)
        reset()
    }

    return (
        <Drawer classes={{ paper: classes.paper }} variant="permanent" anchor={orientation} className={classes.drawer}>
            <div className={classes.toolbar} />

            <Dialog onClose={handleClose} open={open} fullWidth style={{overflow: 'hidden'}}>
                <DialogTitle>Add a Project</DialogTitle>

                <Grid container justify="center" style={{overflow: 'hidden'}}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container justify="center" spacing={2} style={{marginTop: '1%'}}>
                            {
                                createErros && (
                                    <Grid item xs={12} container justify="center">
                                        <Alert severity="error">
                                            <AlertTitle>Error</AlertTitle>
                                            Project name is already taken or server error.
                                        </Alert>
                                    </Grid>
                                )
                            }

                            <Grid item xs={12} container justify="center">
                                <TextField id="projectName" {...register("projectName", {
                                    required: "Project Name is required"
                                })} error={("projectName" in errors)} helperText={"projectName" in errors && errors.projectName.message} label="Project Name" variant="outlined" />
                            </Grid>

                            <Grid item xs={12} container justify="center">
                                <TextField id="projectDescription" multiline {...register("projectDescription")} error={("projectDescription" in errors)} helperText={"projectDescription" in errors && errors.projectDescription.message} label="Project Description" variant="outlined" />
                            </Grid>

                            <Grid item xs={12} container justify="center">
                                <Button variant="contained" color="primary" type="submit" disabled={Object.keys(errors).length > 0}>Submit</Button>
                            </Grid>

                            <Grid item></Grid>
                        </Grid>
                    </form>
                </Grid>
            </Dialog>

            <Grid container justify="center" spacing={2}>
                <Grid item xs={11}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography style={{fontSize: '18px'}} align="center">Projects</Typography>
                        </Grid>
                        
                        <Grid item>
                            <IconButton onClick={() => setOpen(true)}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider />

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* {
                    projects.map(v => (
                        ))
                    } */}
                        <Stack direction="column" >
                     
                        <Grid item xs={10}  style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}> 
  
                               <IconButton onClick={drop} >
                               <MenuBookIcon /> 
                               </IconButton>
                            <Link to="/company/:id/Docs">
                            <Typography>Docs</Typography>
                            </Link>                      
                        </Grid>
                  

                        {projects ? <>
                        <Link to="/company/:id/usecase">
                        <Grid item xs={10} style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}> 
                                <IconButton>
                               <MenuBookIcon /> 
                               </IconButton> 
                            <Typography>Use Case Documents</Typography>
                        </Grid>
                        </Link>

                        <Link to="/company/:id/Notes">
                        <Grid item xs={10} style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}> 
                                <IconButton>
                               <MenuBookIcon /> 
                               </IconButton> 
                            <Typography>Release Notes</Typography>
                        </Grid>
                        </Link>
                        </> : null}

                        <Link to="/company/:id/Tasks">
                        <Grid item xs={10}  style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}> 
                               <IconButton>
                               <MenuBookIcon /> 
                               </IconButton>
                               <Typography>Tasks</Typography>
                        </Grid>
                        </Link>

                       
                        <Link to="/company/:id/Bugs">
                        <Grid item xs={10}  style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                               <IconButton>
                               <MenuBookIcon /> 
                               </IconButton>
                            <Typography>Bugs</Typography>
                            </Grid>
                        </Link>
                      
                       
                        <Link to="/company/:id/Report">
                        <Grid item xs={10} style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}> 
                               <IconButton>
                               <MenuBookIcon /> 
                               </IconButton>
                            <Typography>Reports</Typography>
                        </Grid>
                        </Link>
                        </Stack>
  
            
            </Grid>
        </Drawer>
    )
}

export default ProjectSideBar;