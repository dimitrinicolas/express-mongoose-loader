# Express Mongoose Loader

Create MongoDB models loaders scripts for your express app

## Installation

```sh
$ npm install express-mongoose-loader
```

## Usage

First call for `express-mongoose-loader` to set up loading system.

```js
app.use(require('express-mongoose-loader'));
```

Then, create a mongoose model loader by requesting mongoose id list to load with the function `req.requestList(listName)`. Add item's data into the object `req.db[listName]` created by `express-mongoose-loader`.

```js
import mongoose from 'mongoose';
import Article from './model/article';

let articlesLoaders = (req, res, next) => {
    Article.find(
        {
            _id: { $in: req.requestList('articles') }
        },
        (err, docs) => {
            if (!err && docs) {
                for (const doc of docs) {
                    req.db.articles[doc.id] = {
                        title: doc.title,
                        datetime: doc.datetime,
                        content: doc.content
                    };
                }
            }
            next();
        }
    );
}
```

Request model's item loading by calling the function `req.load(id)`.

```js
req.load('57f0c59a779f68ea0a70a4e2');
```

After requesting a load you must call your model loader middleware.

```js
app.use(articlesLoaders);
```

## Example App

```js
/* Init your express app */
import express from 'express';

import mongooseLoader from 'express-mongoose-loader';

import mongoose from 'mongoose';
mongoose.connect(/* DB config */);

const app = express();
app.listen(8080);

app.use(mongooseLoader);

/* Create a basic mongoose model */
var ArticleSchema = new mongoose.Schema({
    title: String,
    datetime: Date,
    content: String
});
const Article = mongoose.model('article', ArticleSchema);

/* Create a basic mongoose loader */
let articlesLoaders = (req, res, next) => {
    Article.find(
        {
            _id: { $in: req.requestList('articles') }
        },
        (err, docs) => {
            if (!err && docs) {
                for (const doc of docs) {
                    req.db.articles[doc.id] = {
                        title: doc.title,
                        datetime: doc.datetime,
                        content: doc.content
                    };
                }
            }
            next();
        }
    );
}

/* Create a basic articles loader middleware */
let loadArticles = (req, res, next) => {
    Article.find(
        {
            public: true
        },
        (err, articles) => {
            if (!err && articles) {
                for (const article of articles) {
                    /* Ask for article data loading */
                    req.load('articles', article.id);
                }
            }
        }
    );
}

/* Basic index page */
app.use([loadArticles, articlesLoaders]);
app.get('/',
    (req, res) => {
        let content = '';
        for (const article of req.db.articles) {
            content += '<h1>' + article.title + '</h1><br />';
        }
        res.send(content);
    }
);
```

## License

This project is licensed under the [MIT license](LICENSE).
