import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// SquareはReactコンポーネントのクラス（型）、コンポーネントはpropsと呼ばれるパラメータを受け取り、renderメソッドを通じてビューの階層構造を返す（コンポーネントを効率よく更新して再レンダーする）
// 下記をコンポーネントと言う
// Squareコンポーネントは1つの<button>をレンダーする
class Square extends React.Component {
  // コンストラクタでthis.stateを設定すると状態を持つことができる。
  // まずは、状態を初期化する
  constructor(props) {
    // サブクラスのコンストラクタを呼ぶ場合常にsuperを呼ぶ必要がある、呼ぶべき
    super(props);
    this.state = {
      value: null,
    };
  }

  // renderは描画すべきReact要素（記述するときはJSX）を返す
  render() {
    // この中（ reutrn () ）の記述はJSX、コメントアウトの書き方などに注意が必要
    return (
      // イベントハンドラをbuttonにアロー関数で記述している。onClickプロパティに渡すのは関数であることに注意
      <button
        className="square"
        // this.setStateでStateのvalueを書き換え（更新する）
        onClick={() => this.setState({value: 'X'})}
      >
      {/* JSX内ではjavascriptを中括弧内に記述する、javascriptの変数を扱うことができる */}
      {/* Bordコンポーネントからpropsとしてvalueが渡されいるthis.props.valueで表示が可能 */}
      {/* stateに保管されたvalueを下記で表示する */}
        {this.state.value}
      </button>
    );
  }
}

// BoardコンポーネントはSquareコンポーネントを9個renderする
class Board extends React.Component {
  renderSquare(i) {
    // <Square />のようにカプセル化されたコンポーネントを呼び出すことが可能
    // propsとしてvalueという変数にiを格納しSquareに渡す
    return <Square value={i}/>;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// Gameコンポーネントはプレースホルダーを描画している。
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
