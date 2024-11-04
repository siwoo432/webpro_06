const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand; // プレイヤーの手（グー、チョキ、パー）
  let win = Number(req.query.win); // 勝利数
  let total = Number(req.query.total); // トータルの対戦数
  console.log({ hand, win, total });

  const num = Math.floor(Math.random() * 3 + 1); // CPUの手をランダムに決定
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗の判定
  let judgement;
  if (hand === cpu) {
    judgement = 'あいこ'; // あいこの場合
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち'; // プレイヤーの勝ち
    win += 1; // 勝利数を増やす
  } else {
    judgement = '負け'; // プレイヤーの負け
  }

  total += 1; // トータルの対戦数を増やす

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };

  res.render('janken', display); // 結果を表示
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
