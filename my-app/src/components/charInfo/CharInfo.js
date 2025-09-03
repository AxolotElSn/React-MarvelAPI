import { Component } from 'react';
import PropTypes from 'prop-types'; /* npm i prop-types */

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

import MarvelService from '../../services/MarverService';
import './charInfo.scss';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false, // загрузка изначально false, потому что элемент изначально есть на странице и мы включаем загрузка по действию пользователя
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) { /* метод использует предыдущее состояние (аргумент про состояние не написан) и предыдущие пропсы */ /* этот метод вызывается когда обновляется компонент */
        // this.updateChar() нельзя просто так вызвать этот метод, потому чтор это приведет к бесконечному циклу. Чтоб этого избежать, нам нужны предыдущие состояния и пропсы
        if (this.props.charId !== prevProps.charId) { // То есть мы обновляем только в том случае, если предыдущие данные не совпадают с новыми
            this.updateChar()
        }
    }

    // componentDidCatch(err, info) { // метод вызывается если компонент выкидывает ошибку. err - сама ошибка, info - информация о компоненте в котором произошла ошибка. Но все равно начиная с 16 версии реакта, даже при вызоае этого метода приложение упадет. По этому мы используем предохранители
    //     console.log(err, info)
    //     this.setState({
    //         error: true
    //     })
    // }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => { // загрузка героев
        this.setState({
            char,
            loading: false})
    }

    onCharLoading = () => { // просто загрузка
        this.setState({
            loading: true
        })
    }

    onError = () => { // ошибка, если герой не найден
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>; // skeleton это загрушка. То есть если у нас что-то из этого есть (загрузка, ошибка или герои), то ничего не делаем. Иначе отображаем наш скелетон
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit' : 'cover'}
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'}
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style= {imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character .-.'}
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if (i >= 10) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>        
        </>
    )
}

CharInfo.propTypes = { /* propTpypes - библиотека позволяющая делать валидацию. То есть мы четко говорим что charId - должно быть числом */
    charId: PropTypes.number
}

export default CharInfo;