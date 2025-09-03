

class MarvelService {
	_apiBase = 'https://marvel-server-zeta.vercel.app/';
	_akiKey = 'd4eecb0c66dedbfae4eab45d312fc1df'
	_baseOffset = 210;

    getResourse = async (url) => {
		let res = await fetch(url);

		if(!res.ok) {
			throw new Error(`Cloud not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	}

	getAllCharacters = async (offset = this._baseOffset) => { // получаем всех героев
		const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._akiKey}`);
		return res.data.results.map(this._transformCharacter) // тут мы получаем огромный объект, соответственно перебираем его при помощи map 
	}
	// 1011051 1011311 - id норм персонажей для теста если что
	getCharacter = async (id) => { // получаем одного героя
		const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._akiKey}`);
		return this._transformCharacter(res.data.results[0]) // то есть из этого метода нам возвращаются наши красивые данные которые нам нужны
	}

	_transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name, // получается так. res - результат который мы получили - это один большой объект, у него есть свойство data - это те данные которые получили от сервера, у data есть поле results - это массив с данными, тот есть с нашими героями. Так как мы используем метод getCaracter(), то есть получение одного персонажа, то мы обращаемся к первому элементу массива и записать его имя. В остальных свойствах ниже работает все так же
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character Sorry .-.',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, // тут работает так же, только thumbnail это объект с полями path - путь к картинке и extension - ее разширение. Нам надо сделать единый путь, по этому мы так складываем эти строки
            homepage: char.urls[0].url, // urls - массив с двумя объектами который относятся к homepage и wiki соответственно
            wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}
}

export default MarvelService;