import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup, Container, Row, Col} from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import NaversService from "../services/navers.service";

export default class Navers extends Component {
  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      axios.defaults.baseURL = 'https://navedex-api.herokuapp.com/v1/';
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      this.props.history.push("/login");
      window.location.reload();
    }

    this.state = {
      navers: [],
      newNaverData: {
        name: '',
        job_role: '',
        birthdate: '',
        admission_date: '',
        project: '',
        url: ''
      },
      editNaverData: {
        id: '',
        name: '',
        job_role: '',
        birthdate: '',
        admission_date: '',
        project: '',
        url: ''
      },
      newNaver: false,
      editNaver: false
    };
  }

  componentDidMount() {
    this._refreshNavers();
  }

  toggleNewNaver () {
    this.setState({
      newNaver: !this.state.newNaver
    });
  }

  toggleEditNaver () {
    this.setState({
      editNaver: !this.state.editNaver
    });
  }

  _refreshNavers () {
    NaversService.getNavers().then(
      response => {
        this.setState({
          navers: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  editNaver (id, name, job_role, birthdate, admission_date, project, url) {
    this.setState({editNaverData: {
      id, 
      name,
      job_role,
      birthdate: moment(birthdate).format('YYYY-MM-DD'),
      admission_date: moment(admission_date).format('YYYY-MM-DD'),
      project,
      url
    }, 
    editNaver: !this.state.editNaver
    });
  }

  addNaver () {
    const data = { 
      'name': this.state.newNaverData.name, 
      'job_role': this.state.newNaverData.job_role,
      'birthdate': moment(this.state.newNaverData.birthdate).format('DD/MM/YYYY'),
      'admission_date': moment(this.state.newNaverData.admission_date).format('DD/MM/YYYY'),
      'project': this.state.newNaverData.project,
      'url': this.state.newNaverData.url
    };

    axios.post('navers', data).then((response) => {
      let {navers} = this.state;
      navers.push(response.data);
      this.setState({navers, newNaver:false, newNaverData: {
        name: '',
        job_role: '',
        birthdate: '',
        admission_date: '',
        project: '',
        url: ''
      }});
      return(response.data);
    });
  }

  deleteNaver (id) {
    console.log(id);
    axios.delete(`/navers/${id}`).then((response) => {
      this._refreshNavers();
      this.setState({editNaver:false, editNaverData: {
        id: '',
        name: '',
        job_role: '',
        birthdate: '',
        admission_date: '',
        project: '',
        url: ''
      }});
      return(response.data);
    });
  }

  updateNaver () {
    const data = { 
      'name': this.state.editNaverData.name, 
      'job_role': this.state.editNaverData.job_role,
      'birthdate': moment(this.state.editNaverData.birthdate).format('DD/MM/YYYY'),
      'admission_date': moment(this.state.editNaverData.admission_date).format('DD/MM/YYYY'),
      'project': this.state.editNaverData.project,
      'url': this.state.editNaverData.url
    };
    
    axios.put(`/navers/${this.state.editNaverData.id}`, data).then((response) => {
      this._refreshNavers();
      this.setState({editNaver:false, editNaverData: {
        id: '',
        name: '',
        job_role: '',
        birthdate: '',
        admission_date: '',
        project: '',
        url: ''
      }});
      return(response.data);
    });
  }

  render() {
    let navers = this.state.navers.map((naver, index)=>{
      return (
        <Col key={naver.id}>
          <img alt='' className='foto-naver' src={naver.url} width="250" height="270"/>
          <div className="font-nome"> {naver.name}</div>
          <div className="font-funcao">{naver.job_role}</div>
          
          <Button className="btn btn-dark mr-2" onClick={this.editNaver.bind(this,naver.id, naver.name, naver.job_role, naver.birthdate, naver.admission_date, naver.project, naver.url)}><EditIcon /></Button>
          <Button className="btn btn-dark" onClick={this.deleteNaver.bind(this, naver.id)}><DeleteIcon /></Button>
        </Col>
      )
    });
      
    return (
      <Container >
        <Row xs="2">
          <Col><div class="font-titulo">Navers</div></Col> 
          <Col><Button className="btn btn-dark" onClick={this.toggleNewNaver.bind(this)}>Novo naver</Button></Col>
        </Row>
        <Modal isOpen={this.state.newNaver} toggle={this.toggleNewNaver.bind(this)}>
          <ModalHeader toggle={this.toggleNewNaver.bind(this)}>Novo Naver</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Nome</Label>
              <Input id="name" value={this.state.newNaverData.name} onChange={(e) => {
                let { newNaverData } = this.state;
                newNaverData.name = e.target.value;
                this.setState({ newNaverData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="job_role">Cargo</Label>
              <Input id="job_role" value={this.state.newNaverData.job_role} onChange={(e) =>{
                let {newNaverData} = this.state;
                newNaverData.job_role = e.target.value;
                this.setState({newNaverData});
              }}/>
            </FormGroup>
            <FormGroup>
              <Label for="birthdate">Data de nascimento</Label>
              <Input type="date" format="dd/MM/yyyy" id="birthdate" value={this.state.newNaverData.birthdate} onChange={(e) =>{
                let {newNaverData} = this.state;
                newNaverData.birthdate = e.target.value;
                this.setState({newNaverData});
              }}/>
            </FormGroup>
            <FormGroup>
              <Label for="admission_date">Data de admissão</Label>
              <Input type="date" format="dd/MM/yyyy" id="admission_date" value={this.state.newNaverData.admission_date} onChange={(e) =>{
                let {newNaverData} = this.state;
                newNaverData.admission_date = e.target.value;
                this.setState({newNaverData});
              }}/>
            </FormGroup>
            <FormGroup>
              <Label for="project">Projeto que participou</Label>
              <Input id="project" value={this.state.newNaverData.project} onChange={(e) =>{
                let {newNaverData} = this.state;
                newNaverData.project = e.target.value;
                this.setState({newNaverData});
              }}/>
            </FormGroup>
            <FormGroup>
              <Label for="url">Url da foto do naver</Label>
              <Input id="url" value={this.state.newNaverData.url} onChange={(e) =>{
                let {newNaverData} = this.state;
                newNaverData.url = e.target.value;
                this.setState({newNaverData});
              }}/>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-dark btn-block" onClick={this.addNaver.bind(this)}>Criar</Button>{' '}
            <Button className="btn btn-dark btn-block" onClick={this.toggleNewNaver.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editNaver} toggle={this.toggleEditNaver.bind(this)}>
          <ModalHeader toggle={this.toggleEditNaver.bind(this)}>Novo Naver</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="name">Nome</Label>
            <Input id="name" value={this.state.editNaverData.name} onChange={(e) => {
            let { editNaverData } = this.state;
            editNaverData.name = e.target.value;
            this.setState({ editNaverData });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="job_role">Cargo</Label>
            <Input id="job_role" value={this.state.editNaverData.job_role} onChange={(e) =>{
            let {editNaverData} = this.state;
            editNaverData.job_role = e.target.value;
            this.setState({editNaverData});
            }}/>
          </FormGroup>
          <FormGroup>
            <Label for="birthdate">Data de nascimento</Label>
            <Input type="date" format="dd/MM/yyyy" id="birthdate" value={this.state.editNaverData.birthdate} onChange={(e) =>{
            let {editNaverData} = this.state;
            editNaverData.birthdate = e.target.value;
            this.setState({editNaverData});
            }}/>
          </FormGroup>
          <FormGroup>
            <Label for="admission_date">Data de admissão</Label>
            <Input type="date" format="dd/MM/yyyy" id="admission_date" value={this.state.editNaverData.admission_date} onChange={(e) =>{
            let {editNaverData} = this.state;
            editNaverData.admission_date = e.target.value;
            this.setState({editNaverData});
            }}/>
          </FormGroup>
          <FormGroup>
            <Label for="project">Projeto que participou</Label>
            <Input id="project" value={this.state.editNaverData.project} onChange={(e) =>{
            let {editNaverData} = this.state;
            editNaverData.project = e.target.value;
            this.setState({editNaverData});
            }}/>
          </FormGroup>
          <FormGroup>
            <Label for="url">Url da foto do naver</Label>
            <Input id="url" value={this.state.editNaverData.url} onChange={(e) =>{
            let {editNaverData} = this.state;
            editNaverData.url = e.target.value;
            this.setState({editNaverData});
            }}/>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
          <Button className="btn btn-dark btn-block" onClick={this.updateNaver.bind(this)}>Alterar</Button>{' '}
          <Button className="btn btn-dark btn-block" onClick={this.toggleEditNaver.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Row xs="4">
          {navers}
        </Row>
      </Container>
    );
    
  }
}
