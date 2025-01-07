"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// これより下はBBS関係
app.post("/check", (req, res) => {
  res.json({ number: bbs.length });
});

app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  console.log("read -> " + start);
  if (start == 0) res.json({ messages: bbs });
  else res.json({ messages: bbs.slice(start, start + 5) }); // 1ページ5件表示
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log([name, message]);
  const index = bbs.length; // ユニークなIDとして、現在の配列長を使う
  bbs.push({ name: name, message: message, likes: 0, index: index });
  res.json({ number: bbs.length });
});

app.post("/delete", (req, res) => {
  const index = Number(req.body.index);
  if (index >= 0 && index < bbs.length) {
    bbs.splice(index, 1);
    // インデックス再割り当て
    bbs = bbs.map((post, i) => ({ ...post, index: i }));
    res.json({ number: bbs.length });
  } else {
    res.status(400).send("Invalid index");
  }
});

app.post("/edit", (req, res) => {
  const index = Number(req.body.index);
  const message = req.body.message;
  if (index >= 0 && index < bbs.length) {
    bbs[index].message = message;
    res.json({ message: "Edit successful" });
  } else {
    res.status(400).send("Invalid index");
  }
});

app.post("/like", (req, res) => {
  const index = Number(req.body.index);
  if (index >= 0 && index < bbs.length) {
    bbs[index].likes += 1;
    res.json({ likes: bbs[index].likes });
  } else {
    res.status(400).send("Invalid index");
  }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
