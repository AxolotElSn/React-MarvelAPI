import { Component } from "react";
import PropTypes from 'prop-types';

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundaru/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {

    state = {
        selectedChar: null
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader/>
                <main>
                    <ErrorBoundary>
                        <RandomChar/>
                    </ErrorBoundary>
                    <div className="char__content">
                        <ErrorBoundary>
                            <CharList onCharSelected={this.onCharSelected}/> {/* Отсюда мы получаей id героя на которго кликнули и записываем в здешний стейт */}
                        </ErrorBoundary>
                        <ErrorBoundary> {/* это компонент предохранителя. Он вызывается если в дочернем компоненте есть ошибка */}
                            <CharInfo charId={this.state.selectedChar}/> {/* А тут этот id мы используем */}
                        </ErrorBoundary> 
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }
}

App.propTypes = {
    selectedChar: PropTypes.number
}

export default App;