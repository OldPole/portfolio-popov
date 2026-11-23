import { readPortfolioProfile } from '../../utils/portfolio';

export default defineEventHandler(event => readPortfolioProfile(event));
