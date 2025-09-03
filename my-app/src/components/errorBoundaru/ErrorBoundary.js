// Это компонент предохранитель. Предохранители ловят далеко не все ошибки. Ловят в методах жизненного цикла компонентов, render() и в конструкторах дочерних компонентах. А так же предохранители не ловят ошибки в: обработчиках событий, в асинхронном коде, и в самом себе

import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {

    state = {
        error: false
    }

    // static getDerivedStateFromError(error) { // этот метод только обновляет состояние и никаких других операций тут быть не может
    //     return {error: true};
    // }

    componentDidCatch(error, errorInfo) { // а этот метод вызывается при возникновении ошибки и тут может быть любая логика
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <h2><ErrorMessage/></h2>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;