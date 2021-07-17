import { GeneralProvider } from './GeneralContext';
import { UserProvider } from './UserContext';
import { WishlistProvider } from './User/WishlistContext';
import { CartProvider } from './User/CartContext';
import { RatingsProvider } from './User/RatingsContext';

import combineContexts from '../utils/combineContexts';

const providers = [GeneralProvider, UserProvider, CartProvider, WishlistProvider, RatingsProvider];

export const Provider = combineContexts(...providers);
