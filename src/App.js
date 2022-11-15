import './App.css';
import Form from './Form';

function App() {
  return (
    <div>
      <div id="navbar" style={{display: 'flex', justifyContent: 'space-between', cursor: 'pointer', height: 72, alignItems: 'center', backgroundColor: 'white', borderBottom: "1px solid rgb(226, 226, 226)"}}>
        <img src="https://dd7tel2830j4w.cloudfront.net/f1641881004359x307509114462846340/Captian_FullColor.svg" style={{height: 32, width: 96, marginLeft: 24, cursor: 'pointer'}} />
        <div style={{border: "1px solid rgb(243, 69, 84)", borderRadius: 1000, backgroundColor: 'rgba(230, 28, 103, 0.16', marginRight: 24, width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700, color: 'rgb(243, 69, 84)'}}>D</div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{height: '848px', backgroundColor: 'white', minWidth: '50vw', display: 'flex',  borderRight: '1px solid rgb(226, 226, 226)'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'center', margin: 'auto'}}>
            <img src="https://dd7tel2830j4w.cloudfront.net/f1656453187277x627126060906698200/Form.svg" style={{height: 240, width: 320}}/>
            <h1>Hey, there!</h1>
            <p style={{width: 427, fontSize: 21, color: 'rgb(112, 112, 112)'}}>This is your opportunity to share information about your property damage with our Captain-approved contractors.</p>
          </div>
        </div>
        <Form />
      </div>
    </div>
  );
}

export default App;
