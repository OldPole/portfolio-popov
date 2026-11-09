import type { Project } from '~/types/portfolio'

export const projects: Project[] = [
  {
    slug: 'aligned-hearts',
    name: 'Aligned Hearts',
    year: '2026',
    accent: '#e9d9fb',
    category: { en: 'Startup · Team project', ru: 'Стартап · Командный проект' },
    description: {
      en: 'A space for better conversations. An AI-powered product that helps partners work through relationship conflicts.',
      ru: 'Пространство для диалога. Продукт с ИИ, который помогает партнёрам разбираться в конфликтах в отношениях.',
    },
    contribution: {
      en: 'I developed frontend interfaces: profiles and settings, room creation, messaging and reusable UI components. I connected the frontend to backend APIs and real-time WebSocket communication.',
      ru: 'Я разрабатывал фронтенд: профиль и настройки, создание комнат, обмен сообщениями и переиспользуемые UI-компоненты. Подключал API бэкенда и взаимодействие в реальном времени по WebSocket.',
    },
    highlights: {
      en: [
        'Profile and settings interfaces',
        'Room creation and partner messaging',
        'API integration and real-time communication',
      ],
      ru: [
        'Интерфейсы профиля и настроек',
        'Создание комнат и переписка партнёров',
        'Интеграция API и общение в реальном времени',
      ],
    },
    stack: ['React', 'TypeScript', 'Vite', 'WebSocket'],
    repository: 'https://github.com/lamerous/AlignedHearts',
    image: '/images/projects/aligned-hearts.png',
    gallery: ['/images/projects/aligned-hearts-room.png'],
  },
  {
    slug: 'next-ecommerce',
    name: 'Next Ecommerce',
    year: '2026',
    accent: '#e8e4da',
    category: { en: 'E-commerce · Personal project', ru: 'Интернет-магазин · Личный проект' },
    description: {
      en: 'An online store with a searchable catalog, product filters and a persistent shopping cart. Built with Next.js App Router.',
      ru: 'Интернет-магазин с поиском по каталогу, фильтрами и сохранением корзины. Построен на Next.js App Router.',
    },
    contribution: {
      en: 'I built the storefront with Next.js and TypeScript, implemented server-rendered catalog pages and incremental regeneration for product details, and managed cart state with Zustand.',
      ru: 'Я создал интерфейс магазина на Next.js и TypeScript: каталог с серверным рендерингом, страницы товаров с ISR и корзину с управлением состоянием через Zustand.',
    },
    highlights: {
      en: [
        'Product search and category filters',
        'Server rendering and incremental regeneration',
        'Persistent cart and responsive interface',
      ],
      ru: [
        'Поиск товаров и фильтры по категориям',
        'Серверный рендеринг и ISR',
        'Сохранение корзины и адаптивный интерфейс',
      ],
    },
    stack: ['Next.js', 'TypeScript', 'Zustand', 'Tailwind CSS'],
    repository: 'https://github.com/OldPole/Next-Ecommerce',
    demo: 'https://next-ecommerce-beta-virid.vercel.app',
    image: '/images/projects/next-ecommerce.jpg',
  },
  {
    slug: 'seriespoisk',
    name: 'SeriesPoisk',
    year: '2026',
    accent: '#d8e2e0',
    category: { en: 'Film discovery · Personal project', ru: 'Поиск кино · Личный проект' },
    description: {
      en: 'Discover films and series, explore cast profiles and filter a movie catalog powered by the Kinopoisk API.',
      ru: 'Поиск фильмов и сериалов, страницы актёров и фильтрация каталога на основе API Кинопоиска.',
    },
    contribution: {
      en: 'I built a React and TypeScript application using a feature-based architecture, TanStack Router for navigation and TanStack Query for API data. The interface includes movie details, actor filmographies and a WebSocket echo chat.',
      ru: 'Я создал приложение на React и TypeScript с feature-based архитектурой, TanStack Router для навигации и TanStack Query для данных API. Реализовал страницы фильмов, фильмографии актёров и WebSocket эхо-чат.',
    },
    highlights: {
      en: [
        'Movie catalog with genre and country filters',
        'Film details and actor filmographies',
        'Typed routing and API data caching',
      ],
      ru: [
        'Каталог с фильтрами по жанрам и странам',
        'Страницы фильмов и фильмографии актёров',
        'Типизированный роутинг и кеширование данных API',
      ],
    },
    stack: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS'],
    repository: 'https://github.com/OldPole/React-Series-Poisk',
    demo: 'https://seriespoisk.netlify.app',
    image: '/images/projects/seriespoisk.jpg',
  },
  {
    slug: 'my-dorm',
    name: 'My Dorm',
    year: '',
    accent: '#dbe4fa',
    category: { en: 'Frontend · Team project', ru: 'Фронтенд · Командный проект' },
    description: {
      en: 'A collaborative project where I worked on the frontend application.',
      ru: 'Командный проект, в котором я занимался фронтенд-частью приложения.',
    },
    contribution: {
      en: 'I worked on the frontend part of the project. The repository is maintained by the project author on a separate GitHub account.',
      ru: 'Я занимался фронтенд-частью проекта. Репозиторий находится в GitHub-аккаунте автора проекта.',
    },
    highlights: {
      en: ['Frontend development', 'Team collaboration'],
      ru: ['Разработка фронтенда', 'Командная работа'],
    },
    stack: [],
    repository: 'https://github.com/lamerous/my_dorm',
  },
]
