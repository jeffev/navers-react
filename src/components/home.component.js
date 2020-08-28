import React, { Component } from "react";

import NaversService from "../services/navers.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navers: []
    };
  }

  componentDidMount() {
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

  render() {
    const { navers } = this.state;

    return navers.map((naver, index)=>{
      return (
        <div key={naver.id}>
          <h2> {naver.name}</h2>
          <p>{naver.id}</p>
          <img alt='' src={naver.url} width="300" height="350"/>
        </div>
      )
    })
      
    
  }
}
