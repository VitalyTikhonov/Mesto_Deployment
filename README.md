# Mesto_Deployment v1.0.0
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
