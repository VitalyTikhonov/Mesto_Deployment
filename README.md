# Mesto_Deployment v1.0.0
***For English scroll down***

Учебное задание по разработке серверного приложения на Express.js, подключению его к базе данных MongoDB и развертыванию на облачном сервере с привязкой к доменному имени.
В рамках задания реазиловано:
- централизованная обработка ошибок;
- валидация запросов к серверу до обработки;
- логгирование ошибок;
- публикация бэкенда веб-сайта на облачном сервере с привязкой доменного имени.
## Размещение
Проект задеплоен по следующим адресам:
- http://www.api.vitaliytikhonov.ru/webdev/projects/mesto
- http://api.vitaliytikhonov.ru/webdev/projects/mesto
- https://www.api.vitaliytikhonov.ru/webdev/projects/mesto
- https://api.vitaliytikhonov.ru/webdev/projects/mesto

Дополнительно по адресу http://vitaliytikhonov.ru/webdev/projects/mesto/ размещен фронтенд проекта, созданный на предыдущих этапах курса. 
## Функционал проекта
Сервер (api.vitaliytikhonov.ru/webdev/projects/mesto):
- обрабатывает запросы на создание пользователя и вход в систему (с выдачей токена для быстрого входа), а также запросы с токеном к следующим страницам
   - GET /users (возвращает всех пользователей из базы),
   - GET /users/:userId (возвращает пользователя),
   - GET /cards (возвращает все карточки из базы),
   - POST /cards (создаёт карточку),
   - DELETE /cards/:cardId (удаляет карточку, при условии что она принадлежит пользователю),
   - PUT /cards/<идентификатор_карточки>/likes (ставит лайк карточке),
   - DELETE /cards/<идентификатор_карточки>/likes (снимает лайк с карточки),
а также запросы по несуществующим адресам, отправляя в ответ JSON-объекты.
На предыдущих этапах реализован фронтенд – см. [проект Mesto_Webpack](https://github.com/VitalyTikhonov/Mesto_Webpack/blob/master/README.md).
## Используемые технологии
- MongoDB
- Mongoose
- Node.js
- Express.js
- Nodemon
- Eslint
- bcrypt
- JSON Web Token
- Сelebrate и Joi
- Winston
и др.
## Как воспользоваться проектом:
- выполнять запросы к роутам проекта в сервисе Postman, по необходимости указывая в теле поля с данными.
***
***
# Mesto_Deployment v1.0.0
An academic project on developing a server application in Express.js, connecting it to a MongoDB database, binding to a domain name and deploying it to a cloud server.
Implemented as part of the task:
- centralized error handling;
-  validation of requests to the server prior to processing;
- error logging;
- deployment of the website backend on the cloud server and binding a domain name .
## Access
The project is deployed at the following URLs:
- http://www.api.vitaliytikhonov.ru/webdev/projects/mesto
- http://api.vitaliytikhonov.ru/webdev/projects/mesto
- https://www.api.vitaliytikhonov.ru/webdev/projects/mesto
- https://api.vitaliytikhonov.ru/webdev/projects/mesto

Additionally, at http://vitaliytikhonov.ru/webdev/projects/mesto/ you can see the frontend created at the previous stages of the course.
## Project functionality
The server (api.vitaliytikhonov.ru/webdev/projects/mesto):
- handles requests for user creation and login (issuing a token for quick login), as well as requests with a token to the following pages:
   - GET /users (returns all users from the database),
   - GET /users/:userId (returns the user),
   - GET /cards (returns all cards from the database),
   - POST /cards (creates a card),
   - DELETE /cards /:cardId (deletes the card, provided that it belongs to the user),
   - PUT /cards /<card_id>/likes (to like the card),
   - DELETE /cards/<card_identifier>/likes (removes the like from the card),
as well as requests to non-existent addresses, sending JSON objects in response.
At the previous stages, frontend was implemented: see [Mesto_Webpack project](https://github.com/VitalyTikhonov/Mesto_Webpack/blob/master/README.md).
## Technologies used
- MongoDB
- Mongoose
- Node.js
- Express.js
- Nodemon
- Eslint
- bcrypt
- JSON Web Token
- Celebrate and Joi
- Winston
etc.
## How to use the project:
- execute requests to the routes listed above in the Postman app, specifying data fields in the body, as necessary.
