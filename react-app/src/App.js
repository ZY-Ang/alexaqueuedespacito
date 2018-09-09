import React, { Component } from 'react';
import franceBackgroundImage from './france_background.jpg';
import {Stitch, RemoteMongoClient, AnonymousCredential} from "mongodb-stitch-browser-sdk";
import arrow from './media/arrow.jpg';
import settingsIcon from './settings_icon.png';
import './App.css';
import basicWords from "./basicWords";

const APP_ID = "auto-linguo-xaqwa";
const client = Stitch.initializeDefaultAppClient(APP_ID);
const mongo = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");

const words = ["Bonjour", "Salut", "Merci", "Je", "Tu", "Suis", "Oui", "Non" ];

const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
};

class App extends Component {
    state = {
        wordToShow: null,
        backgroundImgUrl: franceBackgroundImage,
        languageChoice: "french"
    };

    componentDidMount() {
        const word = getRandomWord();
        this.setState({
            wordToShow: word
        });
    }

    saveChanges = () => {
        console.log("The selected language is", this.state.languageChoice);
    };

    selectLanguage = (event) => {
        this.setState({ selectLanguage: event.target.value });
    };

    execute = event => {
        client.auth
            .loginWithCredential(new AnonymousCredential())
            .then(user => {
                const frenchCollection = mongo.db("frenchwords").collection("basic");
                // return frenchCollection.insertMany(basicWords.map(word => ({word})));
                // return frenchCollection.find();
                return frenchCollection.deleteMany({});
            })
            // .then(results => {
            //     console.log("Results: ", results);
            //
            //     const {proxy} = results;
            //     return proxy.executeRead();
            // })
            .then(results => {
                console.log("Results2: ", results);
                // const frenchCollection = mongo.db("frenchwords").collection("basic");
            })
            .catch(console.error);
        if (event) {
            event.preventDefault();
        }
    };


    render() {
        return (
            <div className="App" style={{
                backgroundImage: `url('${this.state.backgroundImgUrl}')`
            }}>
                <header className="App-header">
                    <h1 className="App-title">Learn: <b>French!</b></h1>
                </header>
                <p className="App-intro">
                    {this.state.wordToShow} <img src={arrow} className="word-arrow" /> {this.state.wordToShow}
                </p>
                <button onClick={this.execute}>EXECUTE</button>
                <p className="sub-paragraph"> Open a new tab or refresh for a different word. </p>
                <img className="settings" src={settingsIcon} data-toggle="modal" data-target="#settingsModal" alt="Settings" />
                <div className="modal fade" id="settingsModal" tabIndex="-1" role="dialog" aria-labelledby="settingsModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="settingsModalLabel">Language Preferences</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <select onChange={this.selectLanguage}>
                                    <option id="french">French</option>
                                    <option id="spanish">Spanish</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.saveChanges}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
