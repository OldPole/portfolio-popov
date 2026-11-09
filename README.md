# Kirill Popov — Portfolio

Личное портфолио frontend-разработчика: опыт, навыки, образование, проекты, скачивание CV и контактная форма. Дизайн вдохновлён [benoldham.dev](https://www.benoldham.dev/), реализация написана на Nuxt.

## Стек

Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, Nuxt I18n, Color Mode, Nuxt Image, Zod и Resend. Локальный шрифт Manrope с латиницей и кириллицей (SIL OFL).

## Запуск

Рекомендуется **Node.js 24.22.2 LTS**, версия также указана в `.nvmrc`. Поддерживаемые версии: `^22.22.3 || ^24.15.0 || >=26.0.0`.

В новом окне терминала проверьте окружение:

```powershell
node --version
npm --version
```

```powershell
Set-Location -LiteralPath 'D:\Works\Vue (Nuxt)\Portfolio-Popov'
npm install
npm start
```

Откройте **http://localhost:3000**. Английский язык и тёмная тема включены по умолчанию. `npm run dev` — аналог `npm start`. Остановить сервер: `Ctrl+C`.

Если PowerShell запрещает запуск `npm.ps1`, используйте `npm.cmd install` и `npm.cmd start`; менять политику выполнения не требуется. Для чистой установки после клонирования используйте `npm ci`.

## Проверка в консоли

```powershell
npm run typecheck
npm run build
npm run preview
```

`typecheck` проверяет TypeScript. `build` создаёт production-сборку с предварительным рендерингом языковых страниц. `preview` запускает её локально; адрес указан в консоли. Сначала остановите `npm start`, если он занимает тот же порт.

Для production-запуска собранного сервера: `node .output/server/index.mjs`.

| Команда                     | Назначение                              |
| --------------------------- | --------------------------------------- |
| `npm start` / `npm run dev` | Разработка с обновлением при изменениях |
| `npm run build`             | Production-сборка                       |
| `npm run preview`           | Просмотр production-сборки              |
| `npm run typecheck`         | Проверка типов                          |
| `npm run lint`              | Проверка ESLint                         |
| `npm run format`            | Форматирование                          |
| `npm run format:check`      | Проверка форматирования                 |

Автотесты по текущим требованиям не добавлены. GitHub Actions проверяет типы и сборку, без деплоя.

## Контактная форма

Форма принимает имя, email и сообщение. Получатель — `ipetr6828@gmail.com`. Для доставки нужны аккаунт [Resend](https://resend.com/docs/send-with-nodejs) и адрес отправителя на подтверждённом домене.

```powershell
Copy-Item .env.example .env
```

Заполните локальный `.env`:

```dotenv
NUXT_RESEND_API_KEY=your_resend_api_key
NUXT_CONTACT_FROM=Kirill Popov <portfolio@your-verified-domain.example>
NUXT_CONTACT_TO=ipetr6828@gmail.com
NUXT_CONTACT_ALLOWED_ORIGIN=
```

Для локальной разработки Origin можно оставить пустым. После изменения переменных перезапустите сервер. Production-сервер получает настройки через окружение хостинга.

Без почтовых настроек форма сообщает о недоступности доставки и предлагает прямую почту. Email, Telegram, GitHub и LinkedIn доступны всегда. Сообщения не сохраняются в базе или логах. Есть серверная валидация, honeypot, проверка Origin и ограничение частоты отправки. Лимит хранится в памяти процесса; при масштабировании его следует вынести в общее хранилище или на уровень хостинга.

Перед будущим деплоем задайте `NUXT_PUBLIC_SITE_URL` (публичный адрес сайта без пути) и `NUXT_CONTACT_ALLOWED_ORIGIN`, затем выполните `npm run build`. Сейчас сайт не опубликован.

## SEO и скорость

- Главная и страницы трёх проектов предварительно рендерятся на обоих языках.
- Для каждой страницы заданы отдельные title, description, Open Graph и Twitter-метаданные.
- Canonical, hreflang, абсолютные ссылки для предпросмотра и `/sitemap.xml` используют `NUXT_PUBLIC_SITE_URL`. Пока адрес не задан, фиктивные ссылки с localhost не генерируются, а sitemap возвращает 503 с указанием недостающей настройки.
- `/robots.txt` разрешает обход страниц, исключает API и после настройки домена указывает sitemap. Карта содержит обе языковые версии главной и трёх проектов.
- На главной есть структурированные данные Person (JSON-LD).
- Фото оптимизировано в WebP, имеет адаптивные размеры и высокий приоритет загрузки. У изображений указаны размеры; скриншоты ниже первого экрана загружаются лениво.
- Шрифты хранятся локально, основной шрифт предзагружается. Для статических ресурсов заданы Cache-Control, production-файлы сжимаются Brotli/gzip.

Локальный аудит выполняется по production-сборке, а не по `npm start`. Он не заменяет замеры после публикации: итоговая скорость зависит от хостинга, CDN, сети и устройства. Реальные Core Web Vitals и индексацию можно оценить после деплоя.

## Структура

```text
app/
  assets/css/        # Tailwind, переменные тем, стили
  components/
    layout/          # Header, Footer
    sections/        # Hero, Experience, Skills, Projects, Contact
    projects/        # Карточка проекта
    ui/              # Иконки социальных сетей
  composables/       # Форма и язык данных
  data/              # Профиль и опыт
  layouts/           # Оболочка страниц
  pages/             # Главная и projects/[slug]
shared/              # Общие данные проектов, типы и настройки SEO
i18n/locales/        # Переводы en.json и ru.json
modules/             # Совместимость i18n с Windows-путями со скобками
public/
  cv/                # PDF резюме
  fonts/             # Шрифты и лицензия
  images/projects/   # Скриншоты
server/api/          # POST /api/contact
.github/workflows/   # Проверка типов и сборки
```

В текущем пути есть скобки (`Vue (Nuxt)`). `windows-path-compatibility.ts` исправляет сопоставление путей в серверном преобразовании Nuxt I18n 10.6 на Windows. Он включается только для соответствующих путей и не изменяет зависимости.

## Контент и изображения

- Опыт, образование и навыки основаны на предоставленном CV.
- Описания проектов основаны на README и подтверждённом личном вкладе.
- Скриншоты Next Ecommerce и SeriesPoisk сняты с публичных демо.
- Скриншоты Aligned Hearts взяты из README; исходный проект опубликован под GPL-3.0. Авторство команды сохранено ссылкой на репозиторий.
- Фото владельца размещено в Hero на компьютере и телефоне; WebP-версия хранится в `public/images/kirill-popov.webp`.

## Git workflow

- `main`: начальные README и `.gitignore`.
- Первая версия сайта: `2026-11-09.initial-portfolio`.
- Фото и улучшения SEO: `2026-11-09.profile-seo`.
- Следующие ветки: `YYYY-MM-DD.feature-name`.
- Коммиты: `feat: add ...`, `fix: correct ...`, `docs: describe ...`, `chore: configure ...`.
- Первая версия не сливается в `main`.

`.env`, зависимости, кэши и сборки исключены из Git. `.env.example` и `package-lock.json` сохраняются в репозитории.
