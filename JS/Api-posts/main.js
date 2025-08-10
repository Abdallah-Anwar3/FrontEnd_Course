let posts = [];
let editId = null;

let titleInput = document.getElementById("title");
let bodyInput = document.getElementById("body");
let saveBtn = document.getElementById("btn");
let postsDiv = document.querySelector(".posts");

fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
.then(res => res.json())
.then(data => {
    posts = data;
    showPosts();
});

function showPosts() {
    postsDiv.innerHTML = "";
    for (let i = 0; i < posts.length; i++) {
        let postBox = document.createElement("div");
        postBox.className = "post";

        let title = document.createElement("h3");
        title.innerText = posts[i].title;

        let body = document.createElement("p");
        body.innerText = posts[i].body;

        let delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.className = "delete";
        delBtn.onclick = function() {
            deletePost(posts[i].id);
        };

        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.className = "edit";
        editBtn.onclick = function() {
            editPost(posts[i].id);
        };

        postBox.appendChild(title);
        postBox.appendChild(body);
        postBox.appendChild(delBtn);
        postBox.appendChild(editBtn);
        postsDiv.appendChild(postBox);
    }
}

saveBtn.onclick = function() {
    let title = titleInput.value.trim();
    let body = bodyInput.value.trim();

    if (title === "" || body === "") {
        alert("Please fill the fields");
        return;
    }

    if (editId === null) {
        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: title, body: body})
        })
        .then(res => res.json())
        .then(newPost => {
            if (!newPost.id) {
                newPost.id = Date.now();
            }
            posts.push(newPost);
            showPosts();
        });
    } else {
        fetch("https://jsonplaceholder.typicode.com/posts/" + editId, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: title, body: body})
        })
        .then(res => res.json())
        .then(updatedPost => {
            let index = posts.findIndex(p => p.id === editId);
            posts[index] = updatedPost;
            editId = null;
            saveBtn.textContent = "Save Post";
            showPosts();
        });
    }

    titleInput.value = "";
    bodyInput.value = "";
}

function deletePost(id) {
    fetch("https://jsonplaceholder.typicode.com/posts/" + id, {method: "DELETE"})
    .then(() => {
        posts = posts.filter(p => p.id !== id);
        showPosts();
    });
}

function editPost(id) {
    let post = posts.find(p => p.id === id);
    titleInput.value = post.title;
    bodyInput.value = post.body;
    editId = id;
    saveBtn.textContent = "Update Post";
}
