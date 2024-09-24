## Commands

start-command-description = Начать работу с ботом

## Common

save-menu-action-title = Сохранить ✅
back-menu-action-title = Назад 🔙
menu-placeholder = Выбери действие.

error-unhandled = Неизвестное действие. Попробуй начать сначала: /start
error-not-available-menu-action = Такого действия нет в меню.
error-user-id-not-found = ID пользователя не найден.
error-rate-limit-exceeded = Превышен лимит запросов. Немного подожди и попробуй снова.

## Protection

protection-intro-message = Похоже, ты не состоишь в моём закрытом канале, так что, не судьба... Этот бот только для своих 🫡.

## Admin

admin-new-user-message = 
  <b>У нас новый пользователь!</b> 
   
  Имя: <b>{ $firstName }</b>
  Фамилия: <b>{ $lastName }</b>
  Никнейм: <b>@{ $username }</b>
  Язык: <b>{ $languageCode }</b>
  ID: <b>{ $id }</b>

admin-welcome-intro-message = Выбери действие администратора.
admin-welcome-intro-menu-events-action-title = Ивенты ⚙️
admin-welcome-intro-menu-broadcast-action-title = Объявления ⚙️

admin-events-intro-message = Выбери действие с ивентами.
admin-events-intro-menu-add-event-action-title = Добавить ивент 📅
admin-events-add-message = Введи описание нового ивента:
admin-events-verify-message =
  Проверь данные ивента: 
   
  { $description }
admin-events-added-message = Сохранено. Пользователям придёт уведомление о новом ивенте.

admin-broadcast-intro-message = Выбери действие с объявлениями.
admin-broadcast-intro-menu-broadcast-action-title = Сделать объявление 📢
admin-broadcast-add-message = Введи текст объявления:
admin-broadcast-verify-message =
  Проверь данные ивента: 
   
  { $description }
admin-broadcast-added-message = Отправлено. Пользователям придёт уведомление.

admin-user-accepted-event-message =
  <b>Пользователь согласился на участие в ивенте! 🔥</b> 
   
  Пользователь: 
  <b>{ $firstName } { $lastName }</b> 
  <b>@{ $username }</b>
   
  Описание ивента: 
  { $description }
admin-user-subscribed-for-notifications-message =
  <b>Пользователь согласился на уведомления! 💌</b> 
   
  Пользователь: 
  <b>{ $firstName } { $lastName }</b> 
  <b>@{ $username }</b>

## Welcome Feature

welcome-initial-message =
  <b>Привет! 😈</b> 
   
  Этот бот дополнит мой канал несколькими интересными фичами 👀. Они будут добавляться и изменяться по мере необходимости.
welcome-intro-message = Ты в главном меню. Выбери, что тебя интересует.
welcome-intro-menu-events-action-title = Ивенты 🍾

## Events Feature

events-intro-message = 
  Я люблю приятные эмоции 🥹, надеюсь, ты тоже. Как видишь, я часто куда-то езжу и летаю, в основном, на всякие мероприятия/концерты. Если ты вдруг находишься недалеко от места, куда я бы хотел поехать, то у тебя есть возможность <b>присоединиться</b>. 
   
  В таком виде организовать это удобнее всего: мне не придётся писать всем лично, а у тебя появится возможность максимально круто провести <b>1-2 дня</b>. 
   
  Пожалуйста, соглашайся <b>только</b> если ты легкий на подъём человек и любишь новые приключения, как и я. Мне будет не весело, если ты будешь без такого настроя. 
   
  Как только ты согласишься на рассылку, тебе будут приходить сообщения о предстоящих ивентах, и ты сможешь поставить там свой плюсик. Я увижу это, и далее уже напишу тебе лично, чтобы обсудить все детали 😈.
events-intro-menu-subscribe-action-title = Хочу на ивенты 📩

events-subscribed-message = Вау, смело. Тогда жди сообщений о предстоящих ивентах 😎!

events-already-subscribed-message = Ты уже участник моей рассылки. Жди сообщений о предстоящих ивентах 😎!

events-new-event-message = 
  <b>А вот и приглашение! 🎉</b> 
   
  { $description }

events-accept-menu-accept-action-title = Идём! ✨

## Broadcast Feature

broadcast-new-message = 
  <b>Важное объявление! 📢</b> 
   
  { $description }
