import fs from 'fs';
import path from 'path';
import utilStyles from '../../styles/utils.module.css';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { Form, Field, ErrorMessage } from 'formik';
import { render } from 'react-dom';
import {Web3Storage} from 'web3.storage';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";
import { LineAxisOutlined } from '@mui/icons-material';
import axios from 'axios';

const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://wikitechtree-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFFN0MxRDM3NmQ5MEYzNEVkODcwMGQyQzEzNGIzOWM2RkIzMGJlY2UiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTI3MzU4MTg1NTIsIm5hbWUiOiJPcGVuUmVjb24ifQ.g0cEihs9Uh-3CjRTYmIhjsow0w669vtmlf-48xdcRbY'});

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
      paths,
      fallback: false,
    };
}

// function to save to ipfs

// function to save cid to db


export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: 0,
      newData: props.postData.contentMd,
      id: '',
      cid: this.getCID()
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({newData: event.target.value});
  }

  async handleSubmit(event) {
    // alert('An edit was submitted: ' + this.state.newData);
    event.preventDefault();

    /// this works, but need to 
    /// 1. save as md, not json
    const str = JSON.stringify(this.state.newData, null, 2);
    const file = new File([str], 'data.json', {type: 'application/json'});
    const cid = await client.put([file], {wrapWithDirectory: false});
    // console.log(cid);
    this.setState({id: cid});
    this.saveCID(cid);
  }

  saveCID(cid) {
    const db = getDatabase();
  
    // A post entry.
    const postData = {
      id: cid // later on, id should be the editors's username
    };
  
    // Get a key for a new Post.
    // var current = new Date();
    // const newPostKey = current.toLocaleString();
  
    // Write the new post's data in the posts list 
    const updates = {};
    // updates['/posts/' + newPostKey] = postData;
    updates[this.props.postData.title] = postData;
  
    return update(ref(db), updates);
  }

  getCID() {
    const db = getDatabase();
    const postRef = ref(db, this.props.postData.title);
    onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data['id']);
      this.getData(data['id']);
      return data['id'];
    })
  }

  async getData(cid) {
    // get the data corresponding to that CID from IPFS
    // once this works, I'll need to move the functions around to the proper files and then the core technical part will be done (can write the microgrant and improve UI)
    const url = 'https://' + cid + '.ipfs.dweb.link';
    const res = await this.getIPFS(url);
    //const data = JSON.parse(res);
    console.log(res);
  }

  async getIPFS(url) {
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  render() {

    if (this.state.editFlag == 1) {
      return (
        <Layout>
        <Head>
          <title>{this.props.postData.title}</title>
        </Head>
        <h1 className={utilStyles.headingXl}>{this.props.postData.title}</h1>

        <form onSubmit={this.handleSubmit} >

          <textarea type="text" value={this.state.newData} onChange={this.handleChange} class="rounded-md appearance-none relative inline-block w-full h-fit px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-md"/>
          <br/>
          <input class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" type="submit" value="Submit" />
        </form>

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => {this.setState({editFlag: 0})}} >Cancel</button>
      </Layout>
      
      
      
      )} else {
        return (
      <Layout>
        <Head>
          <title>{this.props.postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{this.props.postData.title}</h1>
          {/* <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div> */}
          <div dangerouslySetInnerHTML={{ __html: this.props.postData.contentHtml }} />
          <h1>{this.props.cid}</h1>
        </article>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => {this.setState({editFlag: 1})}}>Edit</button>
      </Layout>
    )}
  }
}
  