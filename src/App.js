import { API } from 'aws-amplify'
import './App.css';
import { useEffect, useState } from 'react';

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

function App() {
  const [submission, setSubmission] = useState({...defaultState});

  const [errorMessage, setErrorMesage] = useState('')

  const [useHomeAddress, setUseHomeAddress] = useState(false);

  const [id, setId] = useState(null)

  useEffect(() => {
    const homeAddress = '123 Main St, Anytown, USA'
    if (useHomeAddress && submission.claimAddress !== homeAddress) {
      setSubmission({...submission, claimAddress: '123 Main St, Anytown, USA'})
    } else if (!useHomeAddress && submission.claimAddress === homeAddress) {
      setSubmission({...submission, claimAddress: ''})
    }
  }, [useHomeAddress, submission])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setSubmission({...submission, [name]: val})
  }

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

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="insuranceCompany" onChange={ handleChange } value={submission.insuranceCompany} placeholder="Insurance Company*" />
      <input type="text" name="claimNumber" onChange={ handleChange } value={submission.claimNumber} placeholder="Claim Number (optional)" />
      <input type="text" name="claimAddress" onChange={ handleChange } value={submission.claimAddress} placeholder="Claim Address*" />
      <input type="checkbox" name="useHomeAddress" onChange={ (e) => setUseHomeAddress(e.target.checked) } checked={useHomeAddress} />
      <label>
        <input type="checkbox" name="hasExterionDamage" onChange={ handleChange } checked={submission.hasExterionDamage} />
        Exterior Damage
      </label>
      <label>
        <input type="checkbox" name="hasInteriorDamage" onChange={ handleChange } checked={submission.hasInteriorDamage} />
        Interior Damage
      </label>
      <label>
        <input type="checkbox" name="hasWaterDamage" onChange={ handleChange } checked={submission.hasWaterDamage} />
        Water
      </label>
      <label>
        <input type="checkbox" name="hasWindDamage" onChange={ handleChange } checked={submission.hasWindDamage} />
        Wind
      </label>
      <label>
        <input type="checkbox" name="hasHailDamage" onChange={ handleChange } checked={submission.hasHailDamage} />
        Hail
      </label>
      <label>
        <input type="checkbox" name="hasFireDamage" onChange={ handleChange } checked={submission.hasFireDamage} />
        Fire
      </label>
      <label>
        Short Damage Description
        <textarea name="damageDescription" onChange={ handleChange } value={submission.damageDescription} placeholder="Description..."/>
      </label>
      { submission.damagePhotos[0] ? <img src={submission.damagePhotos[0]} /> : <input type="file" name="damagePhotos1" /> }
      { submission.damagePhotos[1] ? <img src={submission.damagePhotos[1]} /> : <input type="file" name="damagePhotos2" /> }
      <div>{errorMessage}</div>
      { id ? <button onClick={handleDelete}>Delete</button> : <></>}
      <button type="submit">{id ? "Edit" : "Submit" }</button>
    </form>
  );
}

export default App;
