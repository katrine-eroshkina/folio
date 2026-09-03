# Folio — портфолио

Статический сайт на Vite. Главная + 3 кейса.

## Как запустить локально

```bash
npm install      # один раз, ставит зависимости
npm run dev      # запускает сайт на http://localhost:5173
```

Меняешь файл → сохраняешь (`Ctrl+S`) → в браузере обновляется само.
Остановить сервер — `Ctrl+C` в терминале.

## Как опубликовать изменения

```bash
git add .
git commit -m "коротко что поменяла"
git push
```

Дальше сайт пересоберётся и обновится сам (настроим в фазе 8).

## Где что лежит

| Что | Где |
|---|---|
| Страницы (текст, разметка) | `index.html`, `case-*.html` в корне |
| Шапка и футер (общие) | `src/partials/header.html`, `src/partials/footer.html` |
| Цвета, размеры, отступы | `src/styles/tokens.css` |
| Стили компонентов | `src/styles/components.css` |
| Шрифты | Geist — локально в `src/fonts/geist/`; Playfair Display и JetBrains Mono — пакеты `@fontsource*`. Всё подключено в `src/styles/base.css` |
| Картинки | `src/img/<страница>/` |
| Видео | `public/media/` |
| Аналитика | `src/partials/analytics.html` |

## Что можно менять самой

- Любой видимый текст — прямо в `.html` между тегами.
- Картинку — положить новый файл с тем же именем в `src/img/…` поверх старого.
- Видео — заменить файлы в `public/media/`.
- Цвет / размер шрифта / отступ — значение в `src/styles/tokens.css`.
- Ссылки (t.me, почта, cv) — атрибут `href="…"` в `.html`.

## Что лучше не трогать без надобности

- Вложенность тегов и имена классов (`class="…"`).
- Файлы `vite.config.js`, `package.json`.
- CSS-раскладку (`display: flex/grid`, `position`).

Сломала — откат: `git checkout -- <файл>` или напиши в чат.
