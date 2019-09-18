import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Squareをコンポーネントで定義している場合、受け取ったものをrenderするだけなのでReact用語では、制御されたコンポーネント（controlled componet）と呼ばれる
// クラスの形でも宣言できるが、関数コンポーネントでSquareを定義する。
// 関数コンポーネントはrenderメソッドだけを有して自分のstateを持たないコンポーネントを、シンプルに書くことが可能。
// Square関数コンポーネントは1つの<button>をレンダーする
function Square(props) {
  return (
    // イベントハンドラをbuttonにアロー関数で記述している。onClickプロパティに渡すのは関数であることに注意
    // <button>にonClickプロパティが設定されている為Reactがクリックに対するイベントリスナを設定する。
    // ボタンがクリックされると、onClickのイベントハンドラをコールする
    // 更に,onClickのイベントハンドラがprops.onClick()をコールし、propsで渡されたBoardコンストラクタのthis.handleClick(i)をコールする。
    // React では、イベントを表す props には on[Event] という名前、イベントを処理するメソッドには handle[Event] という名前を付けるのが慣習となっています。
    // props.onClick()でマス目がクリックされた時にpropsで受け取ったonClick()を呼び出している。
    <button className="square" onClick={props.onClick}>
    {/* JSX内ではjavascriptを中括弧内に記述する、javascriptの変数を扱うことができる */}
    {/* Bordコンポーネントからpropsとしてvalueが渡されいるprops.valueで表示が可能 */}
    {/* propsに保管されたvalueを下記で表示する */}
     {props.value}
    </button>
  );
}

// BoatdはReactコンポーネントのクラス（型）、コンポーネントはpropsと呼ばれるパラメータを受け取り、renderメソッドを通じてビューの階層構造を返す（コンポーネントを効率よく更新して再レンダーする）
// 下記をコンポーネントと言う
// BoardコンポーネントはSquareコンポーネントを9個renderする
class Board extends React.Component {
  // コンストラクタでthis.stateを設定すると状態を持つことができる。
  // まずは、状態を初期化する
  constructor(props) {
    // サブクラスのコンストラクタを呼ぶ場合常にsuperを呼ぶ必要がある、呼ぶべき
    super(props);
    this.state = {
      // 初期stateのsquaresに9個のnullが9個のマス目に対応する9個のnull値をセットする。
      squares: Array(9).fill(null),
    }
  }
  // handleClickのイベントハンドラを定義する
  handleClick(i) {
    // .slice()を読んで配列のコピーを作成する。このミューテーとを伴わないデータの変化を行うことで、複雑な機能を簡単に実装できたり、変更の検出が可能になったり、Reactの再レンダータイミングを決定することも可能となる。これをイミュータビリティと呼ぶ。
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    // this.setStateでsquaresの変数を更新している
    this.setState({squares: squares});
  }


  renderSquare(i) {
    // <Square />のようにカプセル化されたコンポーネントを呼び出すことが可能
    // propsとしてvalueという変数にコンストラクタで設定したstateのsquaresの値を格納しSquareに渡す
    return (
      <Square
        value={this.state.squares[i]}
        // BoardからSquareに関数を渡して、マス目がクリックされた時にその関数を読んでもらうようにする
        onClick={() => this.handleClick(i)}
      />
    );

  }
  // renderは描画すべきReact要素（記述するときはJSX）を返す
  render() {
    const status = 'Next player: X';
    // この中（ reutrn () ）の記述はJSX、コメントアウトの書き方などに注意が必要
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
