import React, {useState, useEffect} from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import "./AddEdit.css";
import axios from "axios";
import {toast} from "react-toastify";
import PhoneInput from 'react-phone-number-input/input'

const initialState = {
    name: "",
    email:"",
    contactNo:""
}

const AddEdit = () => {
    const [state, setState] = useState(initialState);
    const {name,email,contactNo} = state;
    const history = useHistory();

    const {id} = useParams();

    useEffect(() => {
        axios. get(`http://localhost:5000/api/get/${id}`)
        .then((resp) => setState({ ...resp.data[0]}));

    },[id])

    const handleSubmit =  (e) => {
        e.preventDefault();
        if(!name || !email || !contactNo)
        {
            toast.error("Please fill all the input fields");
        }
        else{
            if(isNaN(name.charAt(0)))
            {
                if(contactNo.length<13)
                {
                    toast.error("Please provide the contact number with 10 digits");
                }
                else{
                    if(!id)
                {
                    axios.post("http://localhost:5000/api/post",{
                        name,
                        email,
                        contactNo
                    }).then(()=> {
                    setState({name: "", email: "", contactNo: ""})
                    }).catch((err) => toast.error(err.response.data))

                    toast.success("Contact Added Sucessfully");
                    setTimeout(() => history.push("/"), 500);
                }
                else
                {
                    axios.put(`http://localhost:5000/api/update/${id}`,{
                        name,
                        email,
                        contactNo
                    }).then(()=> {
                    setState({name: "", email: "", contactNo: ""})
                    }).catch((err) => toast.error(err.response.data))

                    toast.success("Contact Updated Sucessfully");
                    setTimeout(() => history.push("/"), 500);
                }

                }
            }
            else{
                toast.error("User Name Should not start with a Number");
            }            
        }
    };


    const handleInputChange =  (e) => {
        const {name, value} = e.target;
        setState({...state, [name]:value});     
    };

    const handlePhoneField = (e) => {
        setState({...state, contactNo:e});
    }

  return (
    <div style={{marginTop: "100px"}}>
        <form style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center"
        }}
        onSubmit={handleSubmit}
        >
            <label htmlFor="name">Name<sup className="mandatory">*</sup></label>
            <input type="text" id="name" name="name" placeholder="Enter Your name..." value={name || ""} onChange={handleInputChange} required />
            <label htmlFor="email">Email<sup className="mandatory">*</sup></label>
            <input type="email" id="email" name="email" placeholder="Enter Your Email..." value={email || ""} onChange={handleInputChange} required/>
            <label htmlFor="contactNo">Contact No<sup className="mandatory">*</sup></label>
            
            

            <PhoneInput
            id="contactNo"
            placeholder="Enter phone number"
            value={contactNo}
            country="IN"
            onChange={handlePhoneField}
            maxLength={11}
            required/>

            <input type="submit" value={id ? "Update": "Save" }/>
            <Link to="/">
                <input type="button" value="Go Back" />
            </Link>
        </form>
    </div>
  )
}

export default AddEdit
