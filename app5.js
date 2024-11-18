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

// じゃんけんのルート
app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  let total = Number(req.query.total);
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = num === 1 ? 'グー' : num === 2 ? 'チョキ' : 'パー';

  let judgement = '';
  if (hand === cpu) {
    judgement = '引き分け';
    total += 1;
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
    total += 1;
  } else {
    judgement = '負け';
  }
  total += 1;

  res.render('janken', {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  });
  res.render( 'janken', display );
});

// おみくじのルート
app.get("/omikuji", (req, res) => {
  const unsei = ["大吉", "中吉", "小吉", "凶", "大凶"];
  const un = unsei[Math.floor(Math.random() * unsei.length)];
  res.render("omikuji", { un });
});

// 数当てゲームのルート
app.get("/number_guess", (req, res) => {
  const user = Number(req.query.number);
  const target = Math.floor(Math.random() * 10) + 1; // 1~10のランダムな数字
  let result = "";

  if (!isNaN(user)) {
    if (user === target) {
      result = "正解！";
    } else {
      result = `不正解！正解は ${target} `;
    }
  }

  res.render("number_guess", { result });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
