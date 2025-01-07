"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');

document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {
        method: "POST",
        body: `name=${name}&message=${message}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    fetch('/post', params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(() => {
            document.querySelector('#message').value = "";
        })
        .catch(console.error);
});

document.querySelector('#check').addEventListener('click', () => {
    const params = {
        method: "POST",
        body: '',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    fetch('/check', params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            if (number !== response.number) {
                const readParams = {
                    method: "POST",
                    body: `start=${number}`,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                };

                fetch('/read', readParams)
                    .then(response => {
                        if (!response.ok) throw new Error('Error');
                        return response.json();
                    })
                    .then(response => {
                        number += response.messages.length;
                        for (let mes of response.messages) {
                            let cover = document.createElement('div');
                            cover.className = 'cover';

                            let name_area = document.createElement('span');
                            name_area.className = 'name';
                            name_area.innerText = mes.name;

                            let mes_area = document.createElement('span');
                            mes_area.className = 'mes';
                            mes_area.innerText = mes.message;

                            let like_btn = document.createElement('button');
                            like_btn.innerText = `❤️ ${mes.likes}`;
                            like_btn.className = 'like';
                            like_btn.dataset.index = mes.index;
                            like_btn.addEventListener('click', () => {
                                const likeParams = {
                                    method: "POST",
                                    body: `index=${mes.index}`,
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                };

                                fetch('/like', likeParams)
                                    .then(response => {
                                        if (!response.ok) throw new Error('Error');
                                        return response.json();
                                    })
                                    .then(() => {
                                        like_btn.innerText = `❤️ ${parseInt(like_btn.innerText.split(' ')[1]) + 1}`;
                                    })
                                    .catch(console.error);
                            });

                            let edit_btn = document.createElement('button');
                            edit_btn.innerText = '編集';
                            edit_btn.className = 'edit';
                            edit_btn.dataset.index = mes.index;
                            edit_btn.addEventListener('click', () => {
                                const newMessage = prompt('新しいメッセージを入力してください:', mes.message);
                                if (newMessage) {
                                    const editParams = {
                                        method: "POST",
                                        body: `index=${mes.index}&message=${newMessage}`,
                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                    };

                                    fetch('/edit', editParams)
                                        .then(response => {
                                            if (!response.ok) throw new Error('Error');
                                            return response.json();
                                        })
                                        .then(() => {
                                            mes_area.innerText = newMessage;
                                        })
                                        .catch(console.error);
                                }
                            });

                            let delete_btn = document.createElement('button');
                            delete_btn.innerText = '削除';
                            delete_btn.className = 'delete';
                            delete_btn.dataset.index = mes.index;
                            delete_btn.addEventListener('click', () => {
                                const deleteParams = {
                                    method: "POST",
                                    body: `index=${mes.index}`,
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                };

                                fetch('/delete', deleteParams)
                                    .then(response => {
                                        if (!response.ok) throw new Error('Error');
                                        return response.json();
                                    })
                                    .then(() => {
                                        cover.remove();
                                    })
                                    .catch(console.error);
                            });

                            cover.appendChild(name_area);
                            cover.appendChild(mes_area);
                            cover.appendChild(like_btn);
                            cover.appendChild(edit_btn);
                            cover.appendChild(delete_btn);

                            bbs.appendChild(cover);
                        }
                    })
                    .catch(console.error);
            }
        })
        .catch(console.error);
});
