import './App.css';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from 'axios';


function App() {
  let [languages, setLanguages] = useState([""])
    let [topics, setTopics] = useState([""])
    const [refreshSecondDD, setRefreshSecondDD] = useState(false);

    const schema = yup.object().shape({
        languageId: yup.string().required("language is required"),
        topicId: yup.string().required("topic is required")

    });
    const { setValue, handleSubmit, formState: { errors }, control, watch } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const topicId = watch("topicId")

    const onSubmit = (data) => {
        console.log(data)
    };

    useEffect(() => {
        getLanguages()
    }, [])

    const getLanguages = async () => {
        const result = await axios.get("https://freeapi.miniprojectideas.com/api/Interview/GetAllLanguage");
        setLanguages(result.data.data);
    }
    const getTopicsByLanguage = async (languageId) => {
        const result = await axios
        .get('https://freeapi.miniprojectideas.com/api/Interview/GetLanguageTopicById?id=' + languageId);
        setTopics(result.data.data)
    }

  return (
    <Container component="main">
    {console.log("topicid in jsx: ",topicId)}
    <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
            control={control}
            name="languageId"
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label" >languageId</InputLabel>
                    <Select

                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        defaultValue={""}
                        label="languageId"
                        onChange={(e) => {
                            setValue('languageId', e.target.value, { shouldValidate: true })
                            getTopicsByLanguage(e.target.value);
                            setRefreshSecondDD(old => !old);
                            setValue('topicId', "", { shouldValidate: true })
                            console.log("topicid in first select onchange: ", topicId);                                   
                        }}                              
                        onBlur={onBlur}
                    >                              
                        {
                            languages?.map((item,index) => (<MenuItem key={index} value={item.languageId}>{item.language}</MenuItem>))
                        }
                    </Select>
                </FormControl>
            )}
        />
        <p className="error">{errors.languageId?.message}</p>

        <Controller
            control={control}
            name="topicId"
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label" >languageTopicId</InputLabel>
                    <Select
                        key={setRefreshSecondDD}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        defaultValue={""}
                        label="languageTopicId"
                        onChange={(e) => {
                            setValue('topicId', e.target.value, { shouldValidate: true })                                   
                        }}                                
                        onBlur={onBlur}
                    >                              
                        {
                            topics?.map((item,index) => (<MenuItem key={index} value={item.languageTopicId}>{item.topicName}</MenuItem>))
                        }
                    </Select>
                </FormControl>
            )}
        />
        <p className="error">{errors.topicId?.message}</p>

        <Button type="submit" variant="contained" color="primary">submit</Button>

    </form>
</Container>
  );
}

export default App;
