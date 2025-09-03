import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarverService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    // constructor(props) {
    //     super(props);
    //     /* this.updateChar(); */ // так делать плохо, потому что мы вызываем метод еще до того как была построена верстка (исправим скоро). Из за этого могут быть баги с запросами
    // }
    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() { // этот метод вызывается как только отрисовался render()
        this.updateChar();
        this.timerId = setInterval(this.updateChar, 25000)
    }

    componentWillUnmount() { /* а этот мектод вызывается когда компонет пропадает со страницы */
        clearInterval(this.timerId);
    }

    onCharLoaded = (char) => { // загрузка героев
        this.setState({
            char, // объект с героем который мы получаем
            loading: false}) // получается тут как только данные загрузились, loadind становится false
    }

    onCharLoading = () => { // просто загрузка
        this.setState({
            loading: true
        })
    }

    onError = () => { // метод выкидывает ошибку, если герой по id не найден
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => { // метод обращается к сервису для получения персонажа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // для начала мы округляем до целого числа, потом записываем в id рандомное число в диапазоне от 1011400 до 1011000
        // console.log(id);
        this.onCharLoading(); // То есть когда мы запускаем обновление наших персонажей, для начала мы запустим спинер, до того момента пока не будет результат
        this.marvelService
            // .getAllCaracters()
            // .then(res => console.log(res))
            .getCharacter(id)
            .then(this.onCharLoaded) // а тут спинер отключится
            .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? <View char={char}/> : null // если сейчас нет загрузки или нет ошибки, то возвращаем компонент View, иначе null

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => { // просто отдельный компонент который просто выводит верстку. Сдедали для удобства, потому что в основном компоненте логика спинера
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit' : 'cover'}
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'}
    }

    return(
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style= {imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;