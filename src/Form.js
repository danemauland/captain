import { API, Storage } from 'aws-amplify'
import { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const apiName = "formSubs";
const path = "/submissions";

const defaultState = {
  insuranceCompany: '',
  claimNumber: '',
  claimAddress: '',
  hasExterionDamage: false,
  hasInteriorDamage: false,
  hasWaterDamage: false,
  hasWindDamage: false,
  hasHailDamage: false,
  hasFireDamage: false,
  damageDescription: '',
  damagePhotos: [],
}

function Form() {
  const [submission, setSubmission] = useState({...defaultState});

  const [errorMessage, setErrorMesage] = useState('')

  const [useHomeAddress, setUseHomeAddress] = useState(false);

  const [id, setId] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);

  // Updates the address when the "use hometown" checkbox is checked/unchecked
  useEffect(() => {
    const homeAddress = '123 Main St, Anytown, USA'
    if (useHomeAddress && submission.claimAddress !== homeAddress) {
      setSubmission({...submission, claimAddress: '123 Main St, Anytown, USA'})
    } else if (!useHomeAddress && submission.claimAddress === homeAddress) {
      setSubmission({...submission, claimAddress: ''})
    }
  }, [useHomeAddress, submission])

  // Updates the submission state when a form field is changed
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setSubmission({...submission, [name]: val})
  }

  // Handles the form submission for new submissions and edits
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submission.insuranceCompany) {
      setErrorMesage('Please enter an insurance company')
      return;
    } else if (!submission.claimAddress) {
      setErrorMesage('Please enter a claim address')
      return;
    }
    let apiPath;
    let resp;
    try {
      if (id) {
        apiPath = path + '/object/' + id;
        resp = await API.patch(apiName, apiPath, {body: submission})
      } else {
        apiPath = path;
        resp = await API.post(apiName, apiPath, {body: submission})
        setId(resp.data)
      }

      softReset()
    } catch (err) {
      console.log(err)
      setErrorMesage(err.message)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    await API.del(apiName, path + '/object/' + id)

    hardReset()
  }

  const softReset = () => {
    setErrorMesage('')
  }

  const hardReset = () => {
    softReset()
    setUseHomeAddress(false)
    setId(null)
    setSubmission({...defaultState})
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const fileName = file.name + Date.now();
    if (file) {
      Storage.put(fileName, file)
        .then (result => {
          setImageFiles([...imageFiles, URL.createObjectURL(file)])
          setSubmission({...submission, damagePhotos: [...submission.damagePhotos, result.key]})
        })
        .catch(err => console.log(err));
    }
  }

  const handleAddressChange = (val) => {
    setSubmission({...submission, claimAddress: val.value?.description || val.value})
  }

  return (
    <form onSubmit={handleSubmit} style={{padding: 24}}>
      <h1>Damage Information Form</h1>
      <div className='formSection'>
        <h3>Basic Info</h3>
        <input type="text" name="insuranceCompany" onChange={ handleChange } value={submission.insuranceCompany} placeholder="Insurance Company*" />
        <input type="text" name="claimNumber" onChange={ handleChange } value={submission.claimNumber} placeholder="Claim Number (optional)" />
        <GooglePlacesAutocomplete apiKey='AIzaSyA1EKjNy7qKW_REwyuhV37ti5SAqtrz9Gs' selectProps={{inputValue: submission.claimAddress, value: submission.claimAddress, onChange: handleAddressChange, onInputChange: handleAddressChange, placeholder: "Claim Address*"}} />
        <label>
          <input type="checkbox" name="useHomeAddress" onChange={ (e) => setUseHomeAddress(e.target.checked) } checked={useHomeAddress} />
          Use my Home Address
        </label>
      </div>
      <div className='formSection checkboxSection'>
        <h3>Damage Info</h3>
        <div id="checkboxSubsection1">
            <h4>Damage Type</h4>
          <label>
            <input type="checkbox" name="hasExterionDamage" onChange={ handleChange } checked={submission.hasExterionDamage} />
            Exterior Damage
          </label>
          <label>
            <input type="checkbox" name="hasInteriorDamage" onChange={ handleChange } checked={submission.hasInteriorDamage} />
            Interior Damage
          </label>
        </div>
        <div className="checkboxSubsection2">
          <h4>Cause of Damage</h4>
          <label>
            <input type="checkbox" name="hasWaterDamage" onChange={ handleChange } checked={submission.hasWaterDamage} />
            Water
          </label>
          <label className="spaced">
            <input type="checkbox" name="hasFireDamage" onChange={ handleChange } checked={submission.hasFireDamage} />
            Fire
          </label>
          <br/>
          <label>
            <input type="checkbox" name="hasWindDamage" onChange={ handleChange } checked={submission.hasWindDamage} />
            Wind
          </label>
          <label className="spaced">
            <input type="checkbox" name="hasHailDamage" onChange={ handleChange } checked={submission.hasHailDamage} />
            Hail
          </label>
        </div>
        <label className='textareaLabel'>
          <div>
            <div>Short Damage Description</div>
            <textarea name="damageDescription" onChange={ handleChange } value={submission.damageDescription} placeholder="Description..."/>
          </div>
        </label>
      </div>
      <div className='formSection'>
        <h3>Photos of Damage (optional)</h3>
        <div className='imageContainer'>
        { imageFiles[0] ? <img src={imageFiles[0]} /> : <label>+<input type="file" name="damagePhotos1" onChange={handleImageUpload} /></label> }
        { imageFiles[1] ? <img src={imageFiles[1]} /> : <label>+<input type="file" name="damagePhotos2" onChange={handleImageUpload} /></label> }
        </div>
      </div>
      <div style={{color: 'rgb(230, 28, 103)'}}>{errorMessage}</div>
      <div className='buttons'>
        { id ? <button onClick={handleDelete}>Delete</button> : <></>}
        <button type="submit">{id ? "Edit" : "Submit" }</button>
      </div>
    </form>
  );
}

export default Form;
