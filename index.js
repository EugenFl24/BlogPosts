import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

let posts = [];
let userIsAuthorised = false;

// Configura Express para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));
// Configura Express para utilizar body-parser
app.use(bodyParser.urlencoded({ extended: true }));



// Función para renderizar la página principal
function renderHomePage(req, res) {
    res.render("index.ejs", { userIsAuthorised: userIsAuthorised });
}

// Función para renderizar la página de blog
function renderBlogPage(req, res) {
    res.render("blogposts.ejs", { posts: posts });
}

app.get("/", renderHomePage);

app.post("/submit", (req, res) => {
    const password = req.body.password;
    if (password === "pollos240896") {
        userIsAuthorised = true;
        renderBlogPage(req, res);
    } else {
        res.redirect("/");
    }
});

// Ruta para manejar el formulario de agregar posts
app.post("/addpost", (req, res) => {
    const newPost = req.body.postContent;
    posts.push(newPost);
    res.redirect("/blogposts");
});

// Ruta para manejar la solicitud POST de eliminación de un post
app.post("/deletepost", (req, res) => {
    const postIndex = req.body.postIndex;
    // Elimina el post del array utilizando su índice
    posts.splice(postIndex, 1);
    // Redirige de vuelta a la página de blog después de eliminar el post
    res.redirect("/blogposts");
});

// Ruta para manejar la solicitud GET de edición de un post
app.get("/editpost", (req, res) => {
    const postIndex = req.query.postIndex;
    const postContent = posts[postIndex];
    res.render("editpost.ejs", { postIndex: postIndex, postContent: postContent });
});

// Ruta para manejar la solicitud POST de actualización de un post editado
app.post("/updatepost", (req, res) => {
    const postIndex = req.body.postIndex;
    const newPostContent = req.body.newPostContent;
    // Actualiza el contenido del post en el array utilizando su índice
    posts[postIndex] = newPostContent;
    // Redirige de vuelta a la página de blog después de actualizar el post
    res.redirect("/blogposts");
});

// Ruta para manejar la solicitud GET de la página de blog
app.get("/blogposts", renderBlogPage);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
