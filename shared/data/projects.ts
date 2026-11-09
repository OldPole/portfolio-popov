import type { Project } from '../types/portfolio';

export const projects: Project[] = [
  {
    slug: 'aligned-hearts',
    name: 'Aligned Hearts',
    year: '2026',
    accent: '#e9d9fb',
    category: {
      en: 'Startup · Team project',
      ru: 'Стартап · Командный проект',
    },
    description: {
      en: 'A space for better conversations. An AI-powered product that helps partners work through relationship conflicts.',
      ru: 'Пространство для диалога. Продукт с ИИ, который помогает партнёрам разбираться в конфликтах в отношениях.',
    },
    contribution: {
      en: 'Implemented profile and settings pages, room creation and messaging flows. Built reusable UI components, integrated backend APIs and real-time WebSocket communication, improved existing features and fixed production issues.',
      ru: 'Реализовал страницы профиля и настроек, создание комнат и сценарии обмена сообщениями. Создавал переиспользуемые UI-компоненты, интегрировал API бэкенда и общение по WebSocket, дорабатывал существующие функции и исправлял ошибки в продакшене.',
    },
    highlights: {
      en: [
        'Personal profile and account settings screens.',
        'Room creation and a waiting screen before the partner joins.',
        'A shared messaging interface for the conversation.',
        'Frontend integration with the product backend and WebSockets.',
        'Reusable interface components across the product.',
      ],
      ru: [
        'Личный профиль и экран настроек аккаунта.',
        'Создание комнаты и ожидание подключения партнёра.',
        'Интерфейс обмена сообщениями внутри комнаты.',
        'Интеграция фронтенда с бэкендом и WebSocket.',
        'Переиспользуемые компоненты для экранов продукта.',
      ],
    },
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'TanStack Router',
      'TanStack Query',
      'React Hook Form',
      'Zod',
      'Tailwind CSS',
      'shadcn/ui',
      'WebSocket',
    ],
    repository: 'https://github.com/lamerous/AlignedHearts',
    image: '/images/projects/aligned-hearts.png',
    imageWidth: 1894,
    imageHeight: 1044,
    gallery: [
      {
        src: '/images/projects/aligned-hearts-profile.png',
        width: 1509,
        height: 874,
        caption: {
          en: 'Personal profile',
          ru: 'Личный профиль',
        },
      },
      {
        src: '/images/projects/aligned-hearts-settings.png',
        width: 1178,
        height: 673,
        caption: {
          en: 'Account settings',
          ru: 'Настройки аккаунта',
        },
      },
      {
        src: '/images/projects/aligned-hearts-create.png',
        width: 1459,
        height: 876,
        caption: {
          en: 'Create a conversation room',
          ru: 'Создание комнаты',
        },
      },
      {
        src: '/images/projects/aligned-hearts-wait.png',
        width: 1477,
        height: 830,
        caption: {
          en: 'Waiting for the partner to join',
          ru: 'Ожидание подключения партнёра',
        },
      },
      {
        src: '/images/projects/aligned-hearts-room.png',
        width: 1475,
        height: 892,
        caption: {
          en: 'Room messaging interface',
          ru: 'Интерфейс переписки в комнате',
        },
      },
    ],
    overview: {
      en: [
        'Aligned Hearts is a team-built product for helping partners discuss relationship conflicts. Each person shares their perspective privately; the product brings the two perspectives into a structured dialogue supported by AI analysis and personalised feedback.',
        'I worked on the React frontend: the screens people use before entering a conversation, the room flow and the messaging interface. The gallery follows that journey from a personal profile to a shared room.',
      ],
      ru: [
        'Aligned Hearts — командный продукт, который помогает партнёрам обсуждать конфликты в отношениях. Каждый описывает ситуацию со своей стороны; продукт объединяет эти взгляды в структурированный диалог с ИИ-анализом и персональными рекомендациями.',
        'Я занимался React-фронтендом: личными страницами пользователя, сценарием входа в комнату и интерфейсом общения. Скриншоты показывают этот путь — от профиля до совместной переписки.',
      ],
    },
    implementation: {
      en: [
        {
          title: 'Routing and server data',
          body: 'The frontend uses React with TypeScript, TanStack Router for navigation and TanStack Query for API data. This separates screen navigation from requests and server state.',
        },
        {
          title: 'Forms and shared UI',
          body: 'The interface stack combines React Hook Form, Zod, Tailwind CSS and shadcn/ui with Radix primitives. Shared components support consistent profile, settings and room screens.',
        },
        {
          title: 'Real-time room flow',
          body: 'WebSocket integration connects the messaging interface to the backend. The room journey includes creation, waiting for a partner and the conversation itself, shown in the screenshots below.',
        },
      ],
      ru: [
        {
          title: 'Роутинг и данные сервера',
          body: 'Фронтенд написан на React и TypeScript. TanStack Router отвечает за навигацию, TanStack Query — за данные API. Переходы между экранами отделены от запросов и серверного состояния.',
        },
        {
          title: 'Формы и общий интерфейс',
          body: 'В стеке интерфейса — React Hook Form, Zod, Tailwind CSS и shadcn/ui с примитивами Radix. Общие компоненты используются в профиле, настройках и экранах комнат.',
        },
        {
          title: 'Комнаты и real-time',
          body: 'Интеграция WebSocket связывает интерфейс сообщений с бэкендом. Пользовательский путь включает создание комнаты, ожидание партнёра и сам диалог — эти состояния представлены в галерее.',
        },
      ],
    },
    imageCaption: {
      en: 'Aligned Hearts — landing page',
      ru: 'Aligned Hearts — главная страница',
    },
  },
  {
    slug: 'next-ecommerce',
    name: 'Next Ecommerce',
    year: '2026',
    accent: '#e8e4da',
    category: {
      en: 'E-commerce · Personal project',
      ru: 'Интернет-магазин · Личный проект',
    },
    description: {
      en: 'An online store with a searchable catalog, product filters and a persistent shopping cart. Built with Next.js App Router.',
      ru: 'Интернет-магазин с поиском по каталогу, фильтрами и сохранением корзины. Построен на Next.js App Router.',
    },
    contribution: {
      en: 'Built the storefront with Next.js and TypeScript: catalog browsing, search by product name, category filters and product details. Implemented cart state with Zustand, including quantity changes and persistence, and organised features around the App Router structure.',
      ru: 'Создал интерфейс магазина на Next.js и TypeScript: каталог, поиск по названию, фильтры категорий и страницы товаров. Реализовал состояние корзины на Zustand с изменением количества и сохранением данных; организовал функции вокруг структуры App Router.',
    },
    highlights: {
      en: [
        'Catalog with product cards, prices and pagination.',
        'Search by product name and category filtering.',
        'Product pages with images, descriptions, reviews and delivery information.',
        'Cart with quantity controls and persisted state.',
        'Login screen and an authenticated shopping flow.',
        'Responsive components built with Tailwind CSS and shadcn/ui.',
      ],
      ru: [
        'Каталог с карточками, ценами и пагинацией.',
        'Поиск товаров по названию и фильтрация по категориям.',
        'Страницы товаров с изображениями, описаниями, отзывами и условиями доставки.',
        'Корзина с изменением количества и сохранением состояния.',
        'Экран входа и сценарий покупок после авторизации.',
        'Адаптивные компоненты на Tailwind CSS и shadcn/ui.',
      ],
    },
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Zustand',
      'Tailwind CSS',
      'shadcn/ui',
      'React Hook Form',
      'Zod',
    ],
    repository: 'https://github.com/OldPole/Next-Ecommerce',
    demo: 'https://next-ecommerce-beta-virid.vercel.app',
    image: '/images/projects/next-ecommerce-home.jpg',
    imageWidth: 1905,
    imageHeight: 1072,
    overview: {
      en: [
        'Next Ecommerce is a storefront built with Next.js App Router and the DummyJSON API. The browsing flow connects a searchable product catalog, category filters, individual product pages and a persistent shopping cart.',
        'The project combines server-rendered catalog pages with incremental regeneration for product details. A responsive interface built with Tailwind CSS and shadcn/ui keeps the same browsing flow available across screen sizes.',
      ],
      ru: [
        'Next Ecommerce — интернет-магазин на Next.js App Router с данными DummyJSON API. Пользовательский сценарий связывает каталог с поиском и фильтрами, отдельные страницы товаров и корзину с сохранением состояния.',
        'В проекте сочетаются серверный рендеринг каталога и ISR для страниц товаров. Адаптивный интерфейс на Tailwind CSS и shadcn/ui сохраняет этот сценарий на экранах разного размера.',
      ],
    },
    implementation: {
      en: [
        {
          title: 'Server rendering and ISR',
          body: 'Catalog pages use SSR to render product data on the server. Product details use incremental static regeneration, balancing a quick first response with refreshed product information.',
        },
        {
          title: 'Cart state with Zustand',
          body: 'The cart keeps its state between visits and supports quantity changes. Zustand provides a shared store for cart data used across the shopping interface.',
        },
        {
          title: 'Feature-based App Router structure',
          body: 'The code follows a feature-based architecture adapted to Next.js App Router. Data comes from DummyJSON through the Next.js fetch API; reusable UI is built with shadcn/ui and Tailwind CSS.',
        },
      ],
      ru: [
        {
          title: 'Серверный рендеринг и ISR',
          body: 'Каталог использует SSR для отображения данных на сервере. Для страниц товаров применяется ISR: быстрый первый ответ сочетается с периодическим обновлением информации.',
        },
        {
          title: 'Состояние корзины на Zustand',
          body: 'Корзина сохраняет состояние между посещениями и поддерживает изменение количества товаров. Zustand предоставляет общее хранилище для данных корзины в интерфейсе магазина.',
        },
        {
          title: 'Feature-based структура App Router',
          body: 'Код организован по функциям с учётом Next.js App Router. Данные поступают из DummyJSON через fetch API Next.js; общий интерфейс собран на shadcn/ui и Tailwind CSS.',
        },
      ],
    },
    imageCaption: {
      en: 'Next Ecommerce — storefront and featured collections',
      ru: 'Next Ecommerce — главная и избранные коллекции',
    },
    gallery: [
      {
        src: '/images/projects/next-ecommerce-catalog.jpg',
        width: 1859,
        height: 1072,
        caption: {
          en: 'Product catalog, search and filters',
          ru: 'Каталог, поиск и фильтры',
        },
      },
      {
        src: '/images/projects/next-ecommerce-product.jpg',
        width: 1859,
        height: 1072,
        caption: {
          en: 'Product details and customer reviews',
          ru: 'Страница товара и отзывы',
        },
      },
      {
        src: '/images/projects/next-ecommerce-login.jpg',
        width: 1873,
        height: 1080,
        caption: {
          en: 'Account login screen',
          ru: 'Экран входа в аккаунт',
        },
      },
    ],
  },
  {
    slug: 'seriespoisk',
    name: 'SeriesPoisk',
    year: '2026',
    accent: '#d8e2e0',
    category: {
      en: 'Film discovery · Personal project',
      ru: 'Поиск кино · Личный проект',
    },
    description: {
      en: 'Discover films and series, explore cast profiles and filter a movie catalog powered by the Kinopoisk API.',
      ru: 'Поиск фильмов и сериалов, страницы актёров и фильтрация каталога на основе API Кинопоиска.',
    },
    contribution: {
      en: 'Built the React and TypeScript application using a feature-based architecture with core and features modules. Implemented navigation with TanStack Router and API data handling with TanStack Query, along with catalog filters, film pages, actor filmographies and the WebSocket echo chat.',
      ru: 'Создал приложение на React и TypeScript с feature-based архитектурой и разделением на core и features. Реализовал навигацию на TanStack Router и работу с API через TanStack Query, фильтры каталога, страницы фильмов, фильмографии актёров и WebSocket эхо-чат.',
    },
    highlights: {
      en: [
        'Collections of popular films, top-rated films, series and animation.',
        'A searchable catalog with genre and country filters.',
        'Film details with plot, year, countries, genres, director and cast.',
        'Actor profiles with biographical details, facts and filmographies.',
        'A movie page with an embedded video player.',
        'A WebSocket echo chat that returns the messages sent to it.',
      ],
      ru: [
        'Подборки популярных и лучших фильмов, сериалов и мультфильмов.',
        'Каталог с поиском и фильтрами по жанрам и странам.',
        'Описание фильма, год, страны, жанры, режиссёр и актёрский состав.',
        'Профили актёров с биографией, фактами и фильмографией.',
        'Встроенный видеоплеер на странице фильма.',
        'WebSocket эхо-чат, который возвращает отправленные сообщения.',
      ],
    },
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'TanStack Router',
      'TanStack Query',
      'Tailwind CSS',
      'shadcn/ui',
      'WebSocket',
    ],
    repository: 'https://github.com/OldPole/React-Series-Poisk',
    demo: 'https://seriespoisk.netlify.app',
    image: '/images/projects/seriespoisk-home.jpg',
    imageWidth: 1859,
    imageHeight: 1072,
    overview: {
      en: [
        'SeriesPoisk is a film and series discovery application powered by Kinopoisk API Unofficial. It brings together curated collections, a filterable catalog, film details and actor profiles in a single React interface.',
        'Users can move from a collection to a film, inspect its cast and follow an actor into their filmography. The project also includes a small WebSocket echo chat as a separate real-time interaction.',
      ],
      ru: [
        'SeriesPoisk — приложение для поиска фильмов и сериалов на основе Kinopoisk API Unofficial. В одном React-интерфейсе собраны подборки, каталог с фильтрами, подробные страницы фильмов и профили актёров.',
        'Из подборки можно перейти к фильму, изучить актёрский состав и открыть фильмографию актёра. В проекте также есть отдельный WebSocket эхо-чат для взаимодействия в реальном времени.',
      ],
    },
    implementation: {
      en: [
        {
          title: 'Typed navigation',
          body: 'TanStack Router connects collections, film details and actor pages. The browsing journey stays within the application while each film and actor has its own URL.',
        },
        {
          title: 'API data and caching',
          body: 'TanStack Query handles requests to Kinopoisk API Unofficial and caches API responses. Catalog filters and detail screens use that data layer instead of duplicating request logic in the UI.',
        },
        {
          title: 'Features and shared components',
          body: 'The source separates shared core code from product features. Tailwind CSS, shadcn/ui, Radix primitives and Lucide icons provide the interface building blocks; the echo chat adds a WebSocket example.',
        },
      ],
      ru: [
        {
          title: 'Типизированная навигация',
          body: 'TanStack Router связывает подборки, страницы фильмов и актёров. Переходы происходят внутри приложения, при этом у каждого фильма и актёра есть собственный URL.',
        },
        {
          title: 'Данные API и кеширование',
          body: 'TanStack Query выполняет запросы к Kinopoisk API Unofficial и кеширует ответы. Фильтры каталога и подробные страницы используют этот слой данных вместо дублирования запросов в интерфейсе.',
        },
        {
          title: 'Функции и общие компоненты',
          body: 'В исходниках общий код core отделён от функций продукта. Tailwind CSS, shadcn/ui, примитивы Radix и иконки Lucide формируют UI; эхо-чат добавляет отдельный пример WebSocket-взаимодействия.',
        },
      ],
    },
    imageCaption: {
      en: 'SeriesPoisk — film and series collections',
      ru: 'SeriesPoisk — подборки фильмов и сериалов',
    },
    gallery: [
      {
        src: '/images/projects/seriespoisk-movie.jpg',
        width: 1859,
        height: 1072,
        caption: {
          en: 'Film details and cast',
          ru: 'Информация о фильме и актёрский состав',
        },
      },
      {
        src: '/images/projects/seriespoisk-actor.jpg',
        width: 1859,
        height: 1072,
        caption: {
          en: 'Actor profile and filmography',
          ru: 'Профиль актёра и фильмография',
        },
      },
      {
        src: '/images/projects/seriespoisk-catalog.jpg',
        width: 1859,
        height: 1072,
        caption: {
          en: 'Film catalog with filters',
          ru: 'Каталог фильмов с фильтрами',
        },
      },
    ],
  },
];
