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
    // テンプレートリテラルによりclassNameに'square'とjsを両方代入させる
    // BoardからpropsされてきたisHighlightによりclassにhighlightを追加するかどうかを判断する
    <button
    className={`square ${props.isHighlight ? 'highlight' : ''}`}
    onClick={props.onClick}>
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
  // SquareをrenderSquare()として持ってくる
  renderSquare(i, isHighlight = false) {
    // <Square />のようにカプセル化されたコンポーネントを呼び出すことが可能
    // propsとしてvalueという変数にGameのコンストラクタで設定したstateの更新されたsquaresの値を格納しSquareに渡す
    return (
      <Square
        value={this.props.squares[i]}
        // BoardからSquareに関数を渡して、マス目がクリックされた時にpropsのonClick(i)の関数を作動させる
        onClick={() => this.props.onClick(i)}
        // map関数を用いる為renderSquareにkeyをつけておく
        key={i}
        // SquareにisHighlightを渡せるようにしておく
        isHighlight={isHighlight}
      />
    );

  }
  // renderは描画すべきReact要素（記述するときはJSX）を返す
  render() {
    // この中（ reutrn () ）の記述はJSX、コメントアウトの書き方などに注意が必要
    return (
      <div>
        {/* Array(3)で3つの配列[,,,]を作り、fill(0)で0を当てはめる[0,0,0] */}
        {Array(3).fill(0).map((row, i) => {
          return(
            // keyをつけるとreactが再レンダリングする時に変更点のみレンダリングしてくれるようになる
            <div className="board-row" key={i}>
              {Array(3).fill(0).map((col, j) => {
                  return(
                    // iはrowで0,1,2、jはcolで0,1,2なので
                    // 1行目は012、2行目は345...となる
                    // propsでGameから渡されているhighlightCellsをindexOfが-1でなければtrueを渡す。
                    this.renderSquare(i * 3 + j, this.props.highlightCells.indexOf(i * 3 + j) !== -1)
                  );
                })}
            </div>
          );
          console.log('row',row);
          console.log('i',i);
        })}
      </div>
    );
  }
}

// Gameコンポーネントはプレースホルダーを描画している。
class Game extends React.Component {
  // handleClickのイベントハンドラを定義する
  handleClick(i) {
    // historyをrender内に呼び出し
    // 「時間の巻き戻し」をしてからその時点で新しい着手を起こした場合に、そこから見て「将来」にある履歴を確実に捨てることができる
    // 0番目からクリックしたstepNumber + 1までをコピー
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // 最終の手の一個前を現在のcurrentとする
    const current = history[history.length - 1];
    // .slice()を読んで配列のコピーを作成する。このミューテートを伴わないデータの変化を行うことで、複雑な機能を簡単に実装できたり、変更の検出が可能になったり、Reactの再レンダータイミングを決定することも可能となる。これをイミュータビリティと呼ぶ。
    const squares = current.squares.slice();
    // ゲームの決着がついている場合や、クリックされたマス目が既に埋まっている場合に早期にreturnする
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // xIsNextがtrueのときXが入る、falseのときOが入る
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // this.setStateでsquaresの変数を更新している
    this.setState({
      // ここでは、push()を使わずイミュータビリティのconcat()を利用する
      history: history.concat([{
        squares: squares,
        // 行の更新、クリックした場所（iはsquaresに対応）
        col: (i % 3) + 1,
        // 列の更新、クリックした場所の小数点をMath.floorで切り捨てする。
        row: Math.floor(i / 3) + 1,
      }]),
      stepNumber: history.length,
      // xIsNextを反転させて更新
      xIsNext: !this.state.xIsNext,
    });
  }

  // jumpTo()関数が呼ばれるとstepがstepNumberに代入される
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // 2で割り切れる場合偶数によりtrue
      xIsNext: (step % 2) === 0,
    });
  }

  // 昇順降順を切り替える関数
  toggleAsc() {
    this.setState({
      isAsc: !this.state.isAsc,
    });
  }

  // コンストラクタでthis.stateを設定すると状態を持つことができる。
  // まずは、状態を初期化する
  // 過去のsquaresの配列を、historyの別の配列に保存する。
  // BoardにあるstateをトップレベルのGameコンポーネントにリフトアップする（データを移動する）
  constructor(props) {
    // サブクラスのコンストラクタを呼ぶ場合常にsuperを呼ぶ必要がある、呼ぶべき
    super(props);
    // 初期のstateをコンストラクタ内でセットする
    this.state = {
      history: [{
        // 初期stateのsquaresに9個のnullが9個のマス目に対応する9個のnull値をセットする。
        squares: Array(9).fill(null),
        // 列の保存用
        col: null,
        // 行の保存用
        row: null,
        // 昇順降順切り替え用(trueはASCで昇順)
        isAsc: true,
      }],
      // 何手目の状態を表す
      stepNumber: 0,
      // プレーヤの手番をxIsNext（真偽値）で決める
      xIsNext: true,
    };
  }

  render() {
    // historyをrender内に呼び出し
    const history = this.state.history;
    // 最終の手の一個前を現在のcurrentとする
    const current = history[this.state.stepNumber];
    // currentに該当するsquaresのcaluculateWinnerを取り出し
    // calculateWinner関数を呼び出す。settlementにはwinnerの番号と、勝ったlineが入る。
    const settlement = calculateWinner(current.squares);

    // mapメソッドを使用し、過去の手順にジャンプするためのボタンを表示させる
    const moves = history.map((step, move) => {
      const desc = move ?
        // moveがあれば下記を代入
        'Go to move #' + move + '(' + step.col + ',' + step.row + ')' :
        // moveがなければ下記を代入
        'Go to game start';
      return (
        // keyはそれぞれのコンポーネントの同一性に関する情報をReactに与え、再レンダー間でstateを保持するか保持しないかを決める。
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            // 現在の順番（stepNumber）とmoveが同じ場合boldを入力する
            // cssでboldを定義する
            className={this.state.stepNumber === move ? 'bold' : ''}>{desc}
          </button>
        </li>
      );
    });

    // statusの定義
    let status;
    if (settlement) {
      // isDrawで条件分岐
      if (settlement.isDraw) {
        status = 'Draw'
      } else {
        status = 'Winner: ' + settlement.winner;
      }
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* highlightCellsはsettlementがあればlineを返すなければ[]を返す */}
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightCells={settlement ? settlement.line : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* 降順昇順の切り替えボタンを設置 */}
          <div><button onClick={() => this.toggleAsc()}>ASC||DESC</button></div>
          {/* historyは回数によって増えていく為、クリックに従いolも増えていく */}
          {/* state.isAscがtrueの場合昇順、falseの場合降順表示 */}
          <ol>{this.state.isAsc ? moves : moves.reverse()}</ol>
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

// ヘルパー関数
// 下記はゲームの決着を表す関数
function calculateWinner(squares) {

  // 下記の並び順でOかXであれば勝利
  const lines = [
    // 横並び
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // 縦
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // 斜め
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // squareに書く番号を当てはめ、総当たりで調べる
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 当てはまったら勝利のsquareと揃った列の情報も返す。当てはまらなかった場合のためにisDrawを定義
      return {
        winner: squares[a],
        line: [a,b,c],
        isDraw: false,
      };
    }
  }
  // 上記に当てはまらない場合isDrawをtrueにする
  // ここわからない
  if (squares.filter((e) => !e).length === 0) {
    return {
      winner: null,
      line: [],
      isDraw: true,
    };
  }
  // 全てに当てはまらなかったらnullを返す
  return null;
}
